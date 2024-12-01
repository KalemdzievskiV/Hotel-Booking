import { Image } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link, useNavigate} from "react-router-dom";



export function HomeNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-[#4A5D4A] py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="relative w-8 h-8">
              <Image
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold">GreenDoors</span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to={"/"}
              className="text-white border border-white/30 rounded-full px-4 py-1"
            >
              Home
            </Link>
            <Link 
              to={"/service"}
              className="text-white/90 hover:text-white transition-colors"
            >
              Service
            </Link>
            <Link 
              to={"/event"}
              className="text-white/90 hover:text-white transition-colors"
            >
              Event
            </Link>
            <Link 
              to={"/blog"}
              className="text-white/90 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link 
              to={"/about"}
              className="text-white/90 hover:text-white transition-colors"
            >
              About Us
            </Link>
          </div>

          {/* Auth Buttons */}
          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="outlined"
              className="text-white hover:text-white/90"
              onClick={() => navigate('/signup')}
            >
              Signup
            </Button>
            <Button 
              variant="outlined"
              className="text-white border-lime-900 hover:bg-white hover:text-[#fafafa]"
              onClick={() => navigate('/login')}
            >
              LOGIN
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

