import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { PartnerRoleKey } from '../../src/types/forms'; // Importar o tipo de role

// Assumindo que o req.user é populado por um middleware de autenticação
interface AuthenticatedRequest extends Request {
  user?: {
    auth_user_id: string;
    public_key: string;
    role: PartnerRoleKey;
    email: string;
    name: string;
  };
}

export const createConnectionRequest = async (req: AuthenticatedRequest, res: Response) => {
  const { recipient_public_key, message } = req.body;
  const { public_key: senderPublicKey } = req.user!;

  if (senderPublicKey === recipient_public_key) {
    return res.status(400).json({ error: 'Cannot send a connection request to yourself.' });
  }

  try {
    // Verificar se o destinatário existe
    const { data: recipientUser, error: recipientError } = await supabase
      .from('users')
      .select('public_key')
      .eq('public_key', recipient_public_key)
      .single();

    if (recipientError || !recipientUser) {
      return res.status(404).json({ error: 'Recipient user not found.' });
    }

    // Verificar se já existe uma solicitação pendente ou conexão ativa
    const { data: existingRequest, error: existingRequestError } = await supabase
      .from('partner_requests')
      .select('id, status')
      .or(`and(sender_public_key.eq.${senderPublicKey},recipient_public_key.eq.${recipient_public_key}),and(sender_public_key.eq.${recipient_public_key},recipient_public_key.eq.${senderPublicKey})`);

    if (existingRequestError) {
      throw existingRequestError;
    }

    if (existingRequest && existingRequest.length > 0) {
      const pending = existingRequest.some(r => r.status === 'pending');
      const accepted = existingRequest.some(r => r.status === 'accepted');
      if (pending) {
        return res.status(409).json({ error: 'A pending connection request already exists with this partner.' });
      }
      if (accepted) {
        return res.status(409).json({ error: 'You are already connected with this partner.' });
      }
    }

    const { data: newRequest, error: insertError } = await supabase
      .from('partner_requests')
      .insert({
        sender_public_key: senderPublicKey,
        recipient_public_key,
        message,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({ message: 'Connection request sent successfully.', request: newRequest });
  } catch (error: any) {
    console.error('Error creating connection request:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const getConnectionRequests = async (req: AuthenticatedRequest, res: Response) => {
  const { public_key: userPublicKey } = req.user!;
  const { type } = req.query; // 'incoming' ou 'sent'

  try {
    let query = supabase
      .from('partner_requests')
      .select(`
        id,
        message,
        status,
        created_at,
        sender_public_key,
        recipient_public_key,
        sender:users!partner_requests_sender_public_key_fkey(name, email, public_key, role),
        recipient:users!partner_requests_recipient_public_key_fkey(name, email, public_key, role)
      `);

    if (type === 'incoming') {
      query = query.eq('recipient_public_key', userPublicKey).eq('status', 'pending');
    } else if (type === 'sent') {
      query = query.eq('sender_public_key', userPublicKey);
    } else {
      return res.status(400).json({ error: 'Invalid request type. Must be "incoming" or "sent".' });
    }

    const { data: requests, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json(requests);
  } catch (error: any) {
    console.error('Error fetching connection requests:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const updateConnectionRequestStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepted' ou 'rejected'
  const { public_key: userPublicKey } = req.user!;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected".' });
  }

  try {
    // 1. Verificar se a solicitação existe e se o usuário é o destinatário
    const { data: request, error: requestError } = await supabase
      .from('partner_requests')
      .select('id, recipient_public_key, sender_public_key, status')
      .eq('id', id)
      .single();

    if (requestError || !request) {
      return res.status(404).json({ error: 'Connection request not found.' });
    }

    if (request.recipient_public_key !== userPublicKey) {
      return res.status(403).json({ error: 'Forbidden: You are not the recipient of this request.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: `Request is already ${request.status}.` });
    }

    // 2. Atualizar o status da solicitação
    const { data: updatedRequest, error: updateError } = await supabase
      .from('partner_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Opcional: Se aceito, criar uma entrada em partner_connections (se ainda não existir)
    if (status === 'accepted') {
      const { data: existingConnection, error: connError } = await supabase
        .from('partner_connections')
        .select('id')
        .or(`and(partner_a_key.eq.${request.sender_public_key},partner_b_key.eq.${request.recipient_public_key}),and(partner_a_key.eq.${request.recipient_public_key},partner_b_key.eq.${request.sender_public_key})`);

      if (connError) {
        console.error('Error checking existing connection:', connError);
        // Não lançar erro fatal, apenas logar
      }

      if (!existingConnection || existingConnection.length === 0) {
        const { error: insertConnError } = await supabase
          .from('partner_connections')
          .insert({
            partner_a_key: request.sender_public_key,
            partner_b_key: request.recipient_public_key,
            relationship_type: 'general', // Pode ser mais específico
            status: 'active',
          });

        if (insertConnError) {
          console.error('Error creating partner connection:', insertConnError);
          // Não lançar erro fatal, apenas logar
        }
      }
    }

    return res.status(200).json({ message: `Connection request ${status} successfully.`, request: updatedRequest });
  } catch (error: any) {
    console.error('Error updating connection request status:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const getMyPartners = async (req: AuthenticatedRequest, res: Response) => {
  const { public_key: userPublicKey } = req.user!;

  try {
    // Buscar todas as conexões onde o usuário é partner_a ou partner_b e o status é 'active'
    const { data: connections, error } = await supabase
      .from('partner_connections')
      .select(`
        partner_a_key,
        partner_b_key,
        partner_a:users!partner_connections_partner_a_key_fkey(public_key, name, email, role),
        partner_b:users!partner_connections_partner_b_key_fkey(public_key, name, email, role)
      `)
      .or(`partner_a_key.eq.${userPublicKey},partner_b_key.eq.${userPublicKey}`)
      .eq('status', 'active');

    if (error) {
      throw error;
    }

    // Extrair os parceiros únicos
    const partners = connections.map(conn => {
      if (conn.partner_a_key === userPublicKey) {
        return conn.partner_b;
      } else {
        return conn.partner_a;
      }
    }).filter(Boolean); // Remover nulos/undefined

    return res.status(200).json(partners);
  } catch (error: any) {
    console.error('Error fetching my partners:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};