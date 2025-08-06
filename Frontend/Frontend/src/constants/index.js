import { facebook, instagram, shieldTick, support, truckFast, twitter } from "../assets/icons";

export const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
];

export const statistics = [
    { value: '100+', label: 'Products' },
    { value: '50+', label: 'Categories' },
    { value: '10k+', label: 'Customers' },
];

export const services = [
    {
        imgURL: truckFast,
        label: "Free shipping",
        subtext: "Enjoy seamless shopping with our complimentary shipping service."
    },
    {
        imgURL: shieldTick,
        label: "Secure Payment",
        subtext: "Experience worry-free transactions with our secure payment options."
    },
    {
        imgURL: support,
        label: "Love to help you",
        subtext: "Our dedicated team is here to assist you every step of the way."
    },
];

export const reviews = [
    {
        imgURL: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        customerName: 'Sarah Johnson',
        rating: 4.5,
        feedback: "The attention to detail and the quality of the products exceeded my expectations. Highly recommended!"
    },
    {
        imgURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        customerName: 'Michael Chen',
        rating: 4.5,
        feedback: "The products not only met but exceeded my expectations. I'll definitely be a returning customer!"
    }
];

export const footerLinks = [
    {
        title: "Products",
        links: [
            { name: "Beauty & Cosmetics", link: "/shop" },
            { name: "Fragrances", link: "/shop" },
            { name: "Furniture", link: "/shop" },
            { name: "Electronics", link: "/shop" },
            { name: "Fashion", link: "/shop" },
            { name: "Home & Garden", link: "/shop" },
        ],
    },
    {
        title: "Help",
        links: [
            { name: "About us", link: "/" },
            { name: "FAQs", link: "/" },
            { name: "How it works", link: "/" },
            { name: "Privacy policy", link: "/" },
            { name: "Payment policy", link: "/" },
        ],
    },
    {
        title: "Get in touch",
        links: [
            { name: "customer@tricto.com", link: "mailto:customer@tricto.com" },
            { name: "+92554862354", link: "tel:+92554862354" },
        ],
    },
];

export const socialMedia = [
    { src: facebook, alt: "facebook logo" },
    { src: twitter, alt: "twitter logo" },
    { src: instagram, alt: "instagram logo" },
];
