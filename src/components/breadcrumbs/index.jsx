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
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="text-base font-light flex items-center gap-2 pt-4 pb-8">
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const isEventId = /^\d+$/.test(value);
        const label = isEventId
          ? "Event Details"
          : breadcrumbNameMap[value] || decodeURIComponent(value);

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
