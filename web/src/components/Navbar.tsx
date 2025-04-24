
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="SmartPreço" className="h-12" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#funcionalidades" className="text-gray-600 hover:text-brand-green">Funcionalidades</a>
          <a href="#como-funciona" className="text-gray-600 hover:text-brand-green">Como Funciona</a>
          <a href="#parcerias" className="text-gray-600 hover:text-brand-green">Parcerias</a>
          <Button variant="default" className="bg-brand-green hover:bg-brand-green/90">
            Baixar App
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <a href="#funcionalidades" className="text-lg">Funcionalidades</a>
              <a href="#como-funciona" className="text-lg">Como Funciona</a>
              <a href="#parcerias" className="text-lg">Parcerias</a>
              <Button className="w-full bg-brand-green hover:bg-brand-green/90">
                Baixar App
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
