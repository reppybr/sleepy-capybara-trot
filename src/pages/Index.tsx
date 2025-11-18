import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Leaf, DollarSign } from 'lucide-react';

const mockCoffeeLots = [
  {
    id: 'lot-001',
    name: 'Ethiopian Yirgacheffe',
    origin: 'Yirgacheffe, Ethiopia',
    farm: 'Gesha Village Estate',
    quantity: '500 kg',
    status: 'In Transit',
    pricePerKg: 12.50,
    harvestDate: '2023-01-15',
  },
  {
    id: 'lot-002',
    name: 'Colombian Supremo',
    origin: 'Antioquia, Colombia',
    farm: 'Finca La Esmeralda',
    quantity: '750 kg',
    status: 'Harvested',
    pricePerKg: 9.80,
    harvestDate: '2023-03-01',
  },
  {
    id: 'lot-003',
    name: 'Brazilian Santos',
    origin: 'Minas Gerais, Brazil',
    farm: 'Fazenda Boa Vista',
    quantity: '1200 kg',
    status: 'Processing',
    pricePerKg: 7.20,
    harvestDate: '2023-02-20',
  },
];

const Index = () => {
  return (
    <div className="space-y-8 py-8">
      <h1 className="text-4xl font-bold text-center text-primary">Welcome to CoffeLedger</h1>
      <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
        Your platform for transparent and traceable coffee supply chain management.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCoffeeLots.map((lot) => (
          <Card key={lot.id} className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Package className="h-5 w-5" />
                <span>{lot.name}</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">{lot.origin}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p className="flex items-center space-x-2">
                <Leaf className="h-4 w-4 text-accent" />
                <span>Farm: {lot.farm}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-semibold">Quantity:</span> {lot.quantity}
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-semibold">Status:</span> <span className="text-primary">{lot.status}</span>
              </p>
              <p className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Price/Kg: ${lot.pricePerKg.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-500">Harvested: {lot.harvestDate}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <div className="text-center pt-8">
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Explore All Lots
        </Button>
      </div>
    </div>
  );
};

export default Index;