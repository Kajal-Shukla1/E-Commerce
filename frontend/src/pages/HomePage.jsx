import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/jeans",name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/sweaters", name: "Sweaters", imageUrl: "/sweaters.jpg" },
  { href: "/hats", name: "Hats", imageUrl: "/hats.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ display: "inherit" }}>
        <h1 className="text-5xl font-bold text-center sm:text-6xl text-emerald-400 mb-4">
          Explore Our Collections
        </h1>
        <p className="text-xl text-center text-gray-300 mb-12">
          Discover the latest trends and styles in fashion. Shop now and elevate your wardrobe with our curated collections.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem
              category={category}
              key={category.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;