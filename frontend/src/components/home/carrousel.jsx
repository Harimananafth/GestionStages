export default function Carrousel(){
    const technologies = [
        { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'NodeJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Spring', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'VueJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
        { name: 'Angular', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
        { name: 'Svelte', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
        { name: 'Django', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
        { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    ];

    const extendedTechnologies = [...technologies, ...technologies];

    return(
        <section id="outil" className="bg-stone-50 relative min-h-[60vh] w-full flex flex-col items-center justify-center font-sans p-4 pb-8 pt-28">
                            <svg className="absolute w-1/1 h-[100px] top-[-1px] left-0"  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 100"><g fill="#F2F4F7"><path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path></g></svg>
            <div className="w-full max-w-5xl mx-auto ">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">
                Quelques outils que nous utilisons :
                </h2>

                <div
                className="relative w-full overflow-hidden group"
                style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
                >

                <div className="flex animate-scroll py-8">
                    {extendedTechnologies.map((tech, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        <img src={tech.logo} alt={`${tech.name} logo`} className="h-12 object-contain" />
                    </div>
                    ))}
                </div>
                </div>
            </div>
            <svg className="absolute w-1/1 h-[20px] bottom-[0] rotate-180 left-0"  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 100"><g fill="#E9F3FF"><path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path></g></svg>

        </section>
    )
}