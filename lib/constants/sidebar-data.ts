import {
  IconDashboard,
  IconListDetails,
  IconWallet,
  IconShieldCheck,
  IconSend,
  IconHistory,
} from "@tabler/icons-react"

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Activity",
      url: "/dashboard/activity",
      icon: IconListDetails,
    },
    {
      title: "Wallets",
      url: "/dashboard/wallets",
      icon: IconWallet,
    },
    {
      title: "Payouts",
      url: "/dashboard/payouts",
      icon: IconSend,
    },
    {
      title: "Payout History",
      url: "/dashboard/payout-history",
      icon: IconHistory,
    },
    {
      title: "Compliance",
      url: "/dashboard/compliance",
      icon: IconShieldCheck,
    },
  ],
}
