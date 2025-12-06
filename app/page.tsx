import Link from "next/link";

export default function Home() {
  const sections = [
    {
      title: "Кафедры",
      description: "Управление кафедрами учебного заведения",
      href: "/departments",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Направления подготовки",
      description: "Управление направлениями подготовки",
      href: "/edu-directions",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Учебные планы",
      description: "Управление учебными планами",
      href: "/edu-plans",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Учебные группы",
      description: "Управление группами студентов",
      href: "/edu-groups",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Преподаватели",
      description: "Управление преподавателями вуза",
      href: "/teachers",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      title: "Расписания",
      description: "Создание расписаний и выгрузка в CSV",
      href: "/schedules",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-500">Добро пожаловать в систему управления расписаниями</h1>
      <p className="text-gray-600 mb-8">Выберите раздел для работы</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`${section.color} text-white rounded-lg p-6 shadow-lg transition-all transform hover:scale-105`}
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-white/90">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
