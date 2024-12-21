import { Link } from "react-router-dom";
import { useState } from "react";
import { isActiveLink } from "./LinkActiveChecker";
import { useLocation } from "react-router-dom";
import { sidebarContent } from "../utils/sidebar";

const Sidebar = ({ isOpen, handleToggle, slug }) => {
  const { pathname } = useLocation();
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };
  // const sidebarContent = [
  //   {
  //     id: 1,
  //     name: "Events",
  //     routePath: `/events`,
  //   },
  //   {
  //     id: 2,
  //     name: "Metrics",
  //     routePath: `/metrics`,
  //   },
  //   {
  //     id: 3,
  //     name: "Sheets",
  //     routePath: `/`,
  //     subSections: [
  //       {
  //         id: 1,
  //         name: "Sheets",
  //         routePath: "/sheets",
  //       },
  //       {
  //         id: 2,
  //         name: "Add Sheet",
  //         routePath: "/add-sheet",
  //       },
  //     ],
  //   },
  // ];
  const userId = localStorage.getItem("userId");
  return (
    <div className={`sidebar -dashboard ${isOpen ? "open" : ""}`}>
      {sidebarContent.map((item) => {
        const baseRoutePath = item.routePath.split("?")[0];

        return (
          <div className="sidebar__item" key={item.id}>
            <div
              className={`${
                isActiveLink(baseRoutePath, pathname) ? "-is-active" : ""
              } sidebar__button `}
            >
             
              
                <Link
                  to={`${item.routePath}?userId=${userId}`}
                  className="d-flex items-center text-15 lh-1 fw-500"
                  style={{ textDecoration: "none" }}
                >
                  {item.name}
                </Link>
            </div>
            
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
