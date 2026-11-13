/**
 * Pre-paint inline scripts. Kept in a plain (non-client) module so the server
 * receives real strings, not client references.
 */
export const THEME_KEY = "ga-theme";
export const ROLE_KEY = "ga-role-lens";

export const themeScript = `(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

export const roleScript = `(function(){try{var r=localStorage.getItem('${ROLE_KEY}');if(r)document.documentElement.dataset.role=r}catch(e){}})();`;
