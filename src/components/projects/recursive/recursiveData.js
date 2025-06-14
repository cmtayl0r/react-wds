// 🗂️ File System Structure - Perfect for testing file/folder trees
export const fileSystemData = {
  id: "root",
  name: "My Projects",
  type: "folder",
  children: [
    {
      id: "react-app",
      name: "react-app",
      type: "folder",
      children: [
        {
          id: "src",
          name: "src",
          type: "folder",
          children: [
            { id: "app-js", name: "App.js", type: "file" },
            { id: "index-js", name: "index.js", type: "file" },
            {
              id: "components",
              name: "components",
              type: "folder",
              children: [
                { id: "header-js", name: "Header.js", type: "file" },
                { id: "footer-js", name: "Footer.js", type: "file" },
              ],
            },
          ],
        },
        { id: "package-json", name: "package.json", type: "file" },
        { id: "readme-md", name: "README.md", type: "file" },
      ],
    },
    {
      id: "docs",
      name: "Documentation",
      type: "folder",
      children: [
        { id: "api-md", name: "api.md", type: "file" },
        { id: "setup-md", name: "setup.md", type: "file" },
      ],
    },
    { id: "config-js", name: "config.js", type: "file" },
  ],
};

// 💬 Comments Thread - Great for testing nested discussions
export const commentsData = [
  {
    id: "c1",
    author: "Alice Johnson",
    text: "Great article! Really helped me understand React hooks better.",
    createdAt: "2025-01-15T10:30:00Z",
    replies: [
      {
        id: "c2",
        author: "Bob Smith",
        text: "I agree! The examples were really clear.",
        createdAt: "2025-01-15T11:00:00Z",
        replies: [
          {
            id: "c3",
            author: "Alice Johnson",
            text: "Thanks Bob! Which example did you find most helpful?",
            createdAt: "2025-01-15T11:15:00Z",
            replies: [
              {
                id: "c4",
                author: "Bob Smith",
                text: "The useEffect cleanup example was perfect timing for my current project.",
                createdAt: "2025-01-15T11:30:00Z",
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: "c5",
        author: "Carol Davis",
        text: "Same here! Bookmarked for future reference.",
        createdAt: "2025-01-15T12:00:00Z",
        replies: [],
      },
    ],
  },
  {
    id: "c6",
    author: "David Wilson",
    text: "Could you do a follow-up on custom hooks?",
    createdAt: "2025-01-15T14:00:00Z",
    replies: [
      {
        id: "c7",
        author: "Emily Brown",
        text: "Yes! Custom hooks would be amazing to cover next.",
        createdAt: "2025-01-15T14:30:00Z",
        replies: [],
      },
    ],
  },
];

// 🧭 Navigation Menu - Perfect for testing dropdown menus
export const navigationData = [
  {
    id: "products",
    label: "Products",
    href: "/products",
    children: [
      {
        id: "web-dev",
        label: "Web Development",
        href: "/products/web",
        children: [
          { id: "react", label: "React", href: "/products/web/react" },
          { id: "vue", label: "Vue.js", href: "/products/web/vue" },
          { id: "angular", label: "Angular", href: "/products/web/angular" },
        ],
      },
      {
        id: "mobile-dev",
        label: "Mobile Development",
        href: "/products/mobile",
        children: [
          {
            id: "react-native",
            label: "React Native",
            href: "/products/mobile/react-native",
          },
          { id: "flutter", label: "Flutter", href: "/products/mobile/flutter" },
        ],
      },
      { id: "backend", label: "Backend", href: "/products/backend" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    href: "/resources",
    children: [
      { id: "docs", label: "Documentation", href: "/resources/docs" },
      { id: "tutorials", label: "Tutorials", href: "/resources/tutorials" },
      {
        id: "community",
        label: "Community",
        href: "/resources/community",
        children: [
          { id: "forum", label: "Forum", href: "/resources/community/forum" },
          {
            id: "discord",
            label: "Discord",
            href: "/resources/community/discord",
          },
        ],
      },
    ],
  },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

// 🏢 Organization Chart - Great for testing company hierarchies
export const organizationData = {
  id: "ceo",
  name: "Sarah Chen",
  title: "CEO",
  email: "sarah.chen@company.com",
  children: [
    {
      id: "cto",
      name: "Michael Rodriguez",
      title: "CTO",
      email: "michael.r@company.com",
      children: [
        {
          id: "frontend-lead",
          name: "Emma Thompson",
          title: "Frontend Lead",
          email: "emma.t@company.com",
          children: [
            {
              id: "react-dev1",
              name: "Alex Kim",
              title: "React Developer",
              email: "alex.k@company.com",
            },
            {
              id: "react-dev2",
              name: "Jordan Lee",
              title: "React Developer",
              email: "jordan.l@company.com",
            },
          ],
        },
        {
          id: "backend-lead",
          name: "Ryan Foster",
          title: "Backend Lead",
          email: "ryan.f@company.com",
          children: [
            {
              id: "node-dev",
              name: "Maya Patel",
              title: "Node.js Developer",
              email: "maya.p@company.com",
            },
          ],
        },
      ],
    },
    {
      id: "cmo",
      name: "Lisa Wang",
      title: "CMO",
      email: "lisa.w@company.com",
      children: [
        {
          id: "marketing-spec",
          name: "Tom Johnson",
          title: "Marketing Specialist",
          email: "tom.j@company.com",
        },
        {
          id: "content-mgr",
          name: "Nina Garcia",
          title: "Content Manager",
          email: "nina.g@company.com",
        },
      ],
    },
  ],
};

// 🏷️ Category Tree - Perfect for e-commerce or content categorization
export const categoryData = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    children: [
      {
        id: "computers",
        name: "Computers",
        slug: "computers",
        children: [
          { id: "laptops", name: "Laptops", slug: "laptops" },
          { id: "desktops", name: "Desktops", slug: "desktops" },
          { id: "accessories", name: "Accessories", slug: "accessories" },
        ],
      },
      {
        id: "phones",
        name: "Phones",
        slug: "phones",
        children: [
          { id: "smartphones", name: "Smartphones", slug: "smartphones" },
          { id: "cases", name: "Cases & Covers", slug: "cases" },
        ],
      },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    slug: "clothing",
    children: [
      {
        id: "mens",
        name: "Men's Clothing",
        slug: "mens",
        children: [
          { id: "shirts", name: "Shirts", slug: "shirts" },
          { id: "pants", name: "Pants", slug: "pants" },
        ],
      },
      {
        id: "womens",
        name: "Women's Clothing",
        slug: "womens",
        children: [
          { id: "dresses", name: "Dresses", slug: "dresses" },
          { id: "tops", name: "Tops", slug: "tops" },
        ],
      },
    ],
  },
];

// 🎯 Quick Test Data - Array format (most common for recursive components)
export const simpleTreeData = [
  {
    id: "branch1",
    name: "Branch 1",
    children: [
      { id: "leaf1", name: "Leaf 1" },
      { id: "leaf2", name: "Leaf 2" },
    ],
  },
  {
    id: "branch2",
    name: "Branch 2",
    children: [{ id: "leaf3", name: "Leaf 3" }],
  },
  { id: "leaf4", name: "Leaf 4" },
];
