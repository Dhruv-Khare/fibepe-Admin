import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isApps, setIsApps] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isPages, setIsPages] = useState<boolean>(false);
  const [isBaseUi, setIsBaseUi] = useState<boolean>(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState<boolean>(false);
  const [isForms, setIsForms] = useState<boolean>(false);
  const [isTables, setIsTables] = useState<boolean>(false);
  const [isCharts, setIsCharts] = useState<boolean>(false);
  const [isIcons, setIsIcons] = useState<boolean>(false);
  const [isMaps, setIsMaps] = useState<boolean>(false);
  const [isMultiLevel, setIsMultiLevel] = useState<boolean>(false);

 
  const [isLanding, setIsLanding] = useState<boolean>(false);
  

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("sub-items")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("sub-items");
        const getID = document.getElementById(id) as HTMLElement;
        if (getID) getID.classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
    isLanding,
  ]);

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e: any) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
      
    },
    
   
    
    // {
    //   id: "landing",
    //   label: "Landing",
    //   icon: "ri-rocket-line",
    //   link: "/#",
    //   stateVariables: isLanding,
    //   click: function (e: any) {
    //     e.preventDefault();
    //     setIsLanding(!isLanding);
    //     setIscurrentState("Landing");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "onePage",
    //       label: "One Page",
    //       link: "/landing",
    //       parentId: "landing",
    //     },
    //     {
    //       id: "nftLanding",
    //       label: "NFT Landing",
    //       link: "/nft-landing",
    //       parentId: "landing",
    //     },
    //     {
    //       id: "jobLanding",
    //       label: "Job",
    //       link: "/job-landing",
    //       parentId: "landing",
    //     },
    //   ],
    // },
    // {
    //   label: "Components",
    //   isHeader: true,
    // },
    // {
    //   id: "baseUi",
    //   label: "Base UI",
    //   icon: "ri-pencil-ruler-2-line",
    //   link: "/#",
    //   click: function (e: any) {
    //     e.preventDefault();
    //     setIsBaseUi(!isBaseUi);
    //     setIscurrentState("BaseUi");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isBaseUi,
    //   subItems: [
    //     {
    //       id: "alerts",
    //       label: "Alerts",
    //       link: "/ui-alerts",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "badges",
    //       label: "Badges",
    //       link: "/ui-badges",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "buttons",
    //       label: "Buttons",
    //       link: "/ui-buttons",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "colors",
    //       label: "Colors",
    //       link: "/ui-colors",
    //       parentId: "baseUi",
    //     },
    //     { id: "cards", label: "Cards", link: "/ui-cards", parentId: "baseUi" },
    //     {
    //       id: "carousel",
    //       label: "Carousel",
    //       link: "/ui-carousel",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "dropdowns",
    //       label: "Dropdowns",
    //       link: "/ui-dropdowns",
    //       parentId: "baseUi",
    //     },
    //     { id: "grid", label: "Grid", link: "/ui-grid", parentId: "baseUi" },
    //     {
    //       id: "images",
    //       label: "Images",
    //       link: "/ui-images",
    //       parentId: "baseUi",
    //     },
    //     { id: "tabs", label: "Tabs", link: "/ui-tabs", parentId: "baseUi" },
    //     {
    //       id: "accordions",
    //       label: "Accordion & Collapse",
    //       link: "/ui-accordions",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "modals",
    //       label: "Modals",
    //       link: "/ui-modals",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "offcanvas",
    //       label: "Offcanvas",
    //       link: "/ui-offcanvas",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "placeholders",
    //       label: "Placeholders",
    //       link: "/ui-placeholders",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "progress",
    //       label: "Progress",
    //       link: "/ui-progress",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "notifications",
    //       label: "Notifications",
    //       link: "/ui-notifications",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "media",
    //       label: "Media object",
    //       link: "/ui-media",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "embedvideo",
    //       label: "Embed Video",
    //       link: "/ui-embed-video",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "typography",
    //       label: "Typography",
    //       link: "/ui-typography",
    //       parentId: "baseUi",
    //     },
    //     { id: "lists", label: "Lists", link: "/ui-lists", parentId: "baseUi" },
    //     {
    //       id: "links",
    //       label: "Links",
    //       link: "/ui-links",
    //       parentId: "baseUi",
    //       badgeColor: "success",
    //       badgeName: "New",
    //     },
    //     {
    //       id: "general",
    //       label: "General",
    //       link: "/ui-general",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "ribbons",
    //       label: "Ribbons",
    //       link: "/ui-ribbons",
    //       parentId: "baseUi",
    //     },
    //     {
    //       id: "utilities",
    //       label: "Utilities",
    //       link: "/ui-utilities",
    //       parentId: "baseUi",
    //     },
    //   ],
    // },
    // {
    //   id: "advanceUi",
    //   label: "Advance UI",
    //   icon: "ri-stack-line",
    //   link: "/#",
    //   click: function (e: any) {
    //     e.preventDefault();
    //     setIsAdvanceUi(!isAdvanceUi);
    //     setIscurrentState("AdvanceUi");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isAdvanceUi,
    //   subItems: [
    //     {
    //       id: "scrollbar",
    //       label: "Scrollbar",
    //       link: "/advance-ui-scrollbar",
    //       parentId: "advanceUi",
    //     },
    //     {
    //       id: "animation",
    //       label: "Animation",
    //       link: "/advance-ui-animation",
    //       parentId: "advanceUi",
    //     },
    //     {
    //       id: "swiperslider",
    //       label: "Swiper Slider",
    //       link: "/advance-ui-swiper",
    //       parentId: "advanceUi",
    //     },
    //     {
    //       id: "ratings",
    //       label: "Ratings",
    //       link: "/advance-ui-ratings",
    //       parentId: "advanceUi",
    //     },
    //     {
    //       id: "highlight",
    //       label: "Highlight",
    //       link: "/advance-ui-highlight",
    //       parentId: "advanceUi",
    //     },
    //   ],
    // },
    // {
    //   id: "widgets",
    //   label: "Widgets",
    //   icon: "ri-honour-line",
    //   link: "/widgets",
    //   click: function (e: any) {
    //     e.preventDefault();
    //     setIscurrentState("Widgets");
    //   },
    // },
    // {
    //   id: "forms",
    //   label: "Forms",
    //   icon: "ri-file-list-3-line",
    //   link: "/#",
  
    {
      id: "tables-recharge",
      label: "Recharge Details",
      icon: "ri-layout-grid-line",
      link: "/recharge-details",
      click: function (e: any) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
    },
    {
      id: "tables-utility",
      label: "Utility Details",
      icon: "ri-file-list-3-line",
      link: "/utility-details",
      click: function (e: any) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
    },
    {
      id: "tables-rechargeX",
      label: "Top X Recharge Details",
      icon: "ri-rocket-line",
      link: "/topX-recharge-details",
      click: function (e: any) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
    },
    {
      id: "tables-utilityX",
      label: "Top X Utility Details",
      icon: "ri-pages-line",
      link: "/topX-utility-details",
      click: function (e: any) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
    },
    {
      id: "service-page",
      label: "Service Provider",
      icon: "ri-account-circle-line",
      link: "/service-provider",
      click: function (e: any) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
    },
    {
      id: "operator-page",
      label: "Summary",
      icon: "ri-apps-2-line",
      link: "/summary",
      click: function (e: any) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
    },
    {
      id: "tables-refund",
      label: "Process Refund",
      icon: "ri-layout-grid-line",
      link: "/refund",
      click: function (e: any) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
