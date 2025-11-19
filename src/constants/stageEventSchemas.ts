import { PartnerProfileSchema, PartnerRoleKey } from '@/types/forms';
import { producerStageSchema } from './schemas/stage-events/producer';
import { logisticsStageSchema } from './schemas/stage-events/logistics';
import { warehouseStageSchema } from './schemas/stage-events/warehouse';
import { graderStageSchema } from './schemas/stage-events/grader';
import { roasterStageSchema } from './schemas/stage-events/roaster';
import { packagerStageSchema } from './schemas/stage-events/packager';
import { distributorStageSchema } from './schemas/stage-events/distributor';
import { endConsumerStageSchema } from './schemas/stage-events/end_consumer';
import { sustainabilityStageSchema } from './schemas/stage-events/sustainability';
import { beneficiamentoStageSchema } from './schemas/stage-events/beneficiamento';

export const STAGE_EVENT_SCHEMAS: { [key in PartnerRoleKey]?: PartnerProfileSchema } = {
  producer: producerStageSchema,
  logistics: logisticsStageSchema,
  warehouse: warehouseStageSchema,
  grader: graderStageSchema,
  roaster: roasterStageSchema,
  packager: packagerStageSchema,
  distributor: distributorStageSchema,
  end_consumer: endConsumerStageSchema,
  sustainability: sustainabilityStageSchema,
  beneficiamento: beneficiamentoStageSchema,
};