import { groq } from "next-sanity";

export const heroContentQuery = groq`*[_type == "heroContent"][0]{welcomeBadge, headline, subtitle}`;

export const founderQuery = groq`*[_type == "founder"][0]{bio, extendedRole}`;

export const aboutContentQuery = groq`*[_type == "aboutContent"][0]{companyParagraphs, values, clientIndustries}`;

export const ecosystemDivisionsQuery = groq`*[_type == "ecosystemDivision"] | order(order asc){key, name, tagline, statusLabel, url}`;
