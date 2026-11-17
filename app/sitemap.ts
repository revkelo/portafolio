import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/*
 * Un sitemap solo puede declarar URLs de su propio host: si lista otro
 * dominio, Google lo descarta entero. Por eso sale de la misma variable
 * que el canonical, y no de una constante escrita aparte que se puede
 * quedar atras.
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portafolio.kgstudio.top";

/*
 * Una sola URL, y con fecha de verdad.
 *
 * Antes iban seis entradas: la portada y cinco anclas (`/#about`, `/#stack`...).
 * Un fragmento no es una URL distinta para un buscador -lo recorta y se queda
 * con la portada-, así que eran la misma página declarada seis veces. Las
 * secciones se descubren igual, por los enlaces del menú.
 *
 * La fecha se declara a mano y se toca en el mismo commit que cambia el
 * contenido. Con `new Date()` el sitemap decía "cambió ahora mismo" en cada
 * petición, que es un reloj y no un `lastmod`; a base de mentir, el buscador
 * deja de hacerle caso al campo.
 */
const PORTADA_ACTUALIZADA = new Date("2026-09-01T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: PORTADA_ACTUALIZADA,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
