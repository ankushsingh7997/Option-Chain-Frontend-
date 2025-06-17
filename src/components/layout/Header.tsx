import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, BarChart3, LogOut, Home } from 'lucide-react';
import { selectUserData } from "../../store/selectors";
import { useMutation } from "@apollo/client";
import { clearAllBrokerData } from "../../utils/utils";
import { clearUserData } from "../../store/slices/userSlice";
import { useToast } from "../../hooks/useToast";
import { logoutUser } from "../../graphql/user/user";
import { AppDispatch } from "../../store";

interface HeaderProps {
  page: string;
}

selectUserData

const Header: React.FC<HeaderProps> = ({ page }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch<AppDispatch>();
  const toast=useToast()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path: string) => {
    setIsDropdownOpen(false);
    if("/"+page.toLowerCase()===path) return
    navigate(path);
  };

  const [logout] = useMutation(logoutUser, {
    onCompleted: (data) => {
      if (data.logout?.status) {
        dispatch(clearUserData());
        dispatch(clearAllBrokerData());
        toast.success(data.logout.message || 'Logged out successfully');
      } else {
        toast.error(data.logout.message || 'Logout failed');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Logout failed');
    }
  });

  const handleLogout = () => {
    logout();
  };

  const userName = userData?.name || 'User';

  return (
    <header className="w-full h-[8%] text-white px-8 py-4 flex items-center justify-between border-b border-light-gray">
      <div className="text-18 font-ibm font-medium">{page}</div>
      
      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-light-gray transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-[#004496] rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="font-montserrat text-14 font-medium">{userName}</span>
          <ChevronDown 
            size={16} 
            className={`text-[#9A9A9A] transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-background-3 backdrop-blur-lg border border-light-gray rounded-lg shadow-2xl z-50">
            <div className="py-2">
              {/* Dashboard */}
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-light-gray transition-colors duration-200"
              >
                <Home size={16} className="text-[#9A9A9A]" />
                <span className="font-montserrat text-14 text-white">Dashboard</span>
              </button>

              {/* Broker */}
              <button
                onClick={() => handleNavigation('/broker')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-light-gray transition-colors duration-200"
              >
                <BarChart3 size={16} className="text-[#9A9A9A]" />
                <span className="font-montserrat text-14 text-white">Broker</span>
              </button>

              {/* Divider */}
              <div className="my-1 border-t border-light-gray" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[rgba(240,68,56,0.1)] transition-colors duration-200 group"
              >
                <LogOut size={16} className="text-[#9A9A9A] group-hover:text-[#f04438]" />
                <span className="font-montserrat text-14 text-white group-hover:text-[#f04438]">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;