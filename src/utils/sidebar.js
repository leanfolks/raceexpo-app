export const sidebarContent = [
  {
    id: 1,
    name: "Events",
    routePath: `/events`,
  },
  {
    id: 2,
    name: "Metrics",
    routePath: `/metrics`,
  },
  {
    id: 3,
    name: "Sheets",
    routePath: `/`,
    subSections: [
      {
        id: 1,
        name: "Sheets",
        routePath: "/sheets",
      },
      {
        id: 2,
        name: "Add Sheet",
        routePath: "/add-sheet",
      },
    ],
  },
  {
    id: 4,
    name: "Coupon Dashboard",
    routePath: `/coupon-dashboard`,
  },
  {
    id: 5,
    name: "Runners Club",
    routePath: `/runnerclub-list`,
  },

  {
    id: 6,
    name: "Certificates List",
    routePath: `/certificates-list`,
  },
  {
    id: 7,
    name: "Subscribers List",
    routePath: `/subscribers-list`,
  },
  {
    id: 8,
    name: "Bulk Imports",
    routePath: `/bulk-imports`,
  },
  {
    id: 9,
    name: "Settlements",
    routePath: `/settlements`,
  },
  {
      id: 10,
      name: "Volunteers",
       routePath: `/volunteers`,
  },
  {
    id: 11,
    name: "Reports",
     routePath: `/reports`,
},
  //   {
  //     id: 7,
  //     name: "Results",
  //     routePath: `/results`,
  //   },
];
