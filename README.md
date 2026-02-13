![texto](/public/text-logo.svg)

_El proyecto tendra como funciones crear, alojar y descargar archivos planos(de momento) manteniendo seguridad_

![texto](/public/capture.png)


## Arquitectura
![texto](/public/arquitecture.png)
1. El usuario inicia sesión con Clerk. 
2. Clerk emite un JWT al usuario. 
3. El usuario realiza una solicitud a Supabase, incluyendo un JWT.
4. Supabase verifica con el punto final JWKS de la aplicación Clerk. 
5. Clerk verifica el token. 
6. Supabase responde al usuario con los datos solicitados.