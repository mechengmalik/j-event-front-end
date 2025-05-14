import { useLocation, Link } from "react-router-dom";
import navArrow from "../../assets/icons/navigation-indecator.svg";

const breadcrumbNameMap = {
  dashboard: "Dashboard",
  events: "Events",
  "create-event": "Create Event",
  edit: "Edit Event",
  "sign-in": "Sign In",
  "sign-up": "Sign Up",
  about: "About",
  tickets: "Tickets",
  create: "Create Ticket",  // Changed from "Create" to "Create Ticket"
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="text-base font-light flex items-center gap-2 pt-4">
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const isEventId = /^\d+$/.test(value);
        
        // Determine the label based on path context
        let label;
        
        if (isEventId) {
          label = "Event Details";
        } else if (value === "create" && pathnames.includes("tickets")) {
          // Special case for creating tickets
          label = "Create Ticket";
        } else {
          label = breadcrumbNameMap[value] || decodeURIComponent(value);
        }

        return (
          <span key={to} className="flex items-center gap-2">
            {index !== 0 && <img src={navArrow} alt=">" />}
            {isLast ? (
              <span className="text-[#717171] font-light">{label}</span>
            ) : (
              <Link
                to={to}
                className="text-[#333333] hover:text-black cursor-pointer"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}