# Barents Buss beta

Dette prosjektet er en statisk beta-side for Barents Buss, laget for publisering under:

<https://www.barentsbuss.no/beta/>

## Struktur
- 7 sider med samme hovedmeny som gammel WordPress-side
- Norsk og engelsk tekst
- Flybusstabell, kontaktinformasjon og bilde-/videoside
- Enkel passordskjerm for **For ansatte**
- Metadata for søk og deling

## Kjøring lokalt
Åpne `index.html` direkte i nettleseren, eller bruk en enkel webserver:

```bash
python3 -m http.server 8080
```

Deretter: <http://localhost:8080>

## Publisering
Last opp innholdet i repoet til `/beta/` på webhotellet. Filen `barentsbuss-beta.zip` kan brukes som opplastingspakke hvis den er oppdatert etter siste endringer.

Merk: ansattområdet er kun en lett klient-side sperre. Ikke legg sensitive data direkte i denne statiske siden uten server-side tilgangskontroll.
