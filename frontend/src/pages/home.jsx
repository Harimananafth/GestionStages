import { useEffect } from "react"
import Hero from "../components/home/hero";
import Echantillon from "../components/home/echantillon";
import Carrousel from "../components/home/carrousel";
import Footer from "../components/home/footer";

export default function Home(){

    //Effect au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            } else {
                entry.target.classList.remove("in-view");
            }
            });
        },
        { threshold: 0.2 }
        );

        // Sélectionne tous les éléments avec ces classes
        const targets = document.querySelectorAll(
        ".scaling"
        );

        targets.forEach((el) => observer.observe(el));

        // Nettoyage quand le composant est démonté
        return () => {
        targets.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <>
            <Hero />
            <Echantillon />
            <Carrousel />
            <Footer />
        </>
    )
}