# 🚀 Guide de Déploiement - Architect-Player OS

Ce guide t'explique comment mettre ton app en ligne et l'installer sur mobile.

---

## Option 1: GitHub Pages (Gratuit & Recommandé)

### Étape 1: Créer un compte GitHub
1. Va sur [github.com](https://github.com)
2. Clique sur "Sign up"
3. Crée ton compte

### Étape 2: Créer un nouveau repository
1. Clique sur le **+** en haut à droite → "New repository"
2. Nom du repo: `PersonnalOS` (ou ce que tu veux)
3. Laisse "Public" sélectionné
4. **NE COCHE PAS** "Add a README file"
5. Clique sur "Create repository"

### Étape 3: Uploader tes fichiers
**Option A - Via l'interface web (Plus simple):**
1. Sur la page du repo, clique sur "uploading an existing file"
2. Glisse-dépose TOUS les fichiers et dossiers du projet
3. Clique sur "Commit changes"

**Option B - Via Git (Plus pro):**
```bash
# Dans le dossier PersonnalOS, ouvre un terminal:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/PersonnalOS.git
git push -u origin main
```

### Étape 4: Activer GitHub Pages
1. Va dans **Settings** (onglet en haut du repo)
2. Dans le menu à gauche, clique sur **Pages**
3. Sous "Source", sélectionne **main** et **/ (root)**
4. Clique sur **Save**
5. Attends 2-3 minutes

### Étape 5: Accéder à ton app
Ton app est maintenant accessible sur:
```
https://TON-USERNAME.github.io/PersonnalOS/
```

---

## 📱 Installation sur Mobile (iPhone/Android)

Une fois ton app en ligne:

### Sur iPhone (Safari):
1. Ouvre l'URL dans **Safari**
2. Appuie sur l'icône **Partager** (carré avec flèche)
3. Scroll et appuie sur **"Sur l'écran d'accueil"**
4. Appuie sur **Ajouter**
5. L'app apparaît sur ton écran d'accueil! 🎉

### Sur Android (Chrome):
1. Ouvre l'URL dans **Chrome**
2. Appuie sur les **3 points** en haut à droite
3. Appuie sur **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**
4. Confirme
5. L'app apparaît sur ton écran d'accueil! 🎉

---

## 💻 Installation sur PC (Chrome/Edge)

1. Ouvre l'URL dans Chrome ou Edge
2. Clique sur l'icône **⊕** dans la barre d'adresse (à droite)
3. Clique sur **Installer**
4. L'app s'ouvre comme une vraie application!

---

## 🔄 Mettre à jour l'application

Quand tu fais des changements:

1. Modifie tes fichiers localement
2. Re-upload sur GitHub (ou `git push`)
3. GitHub Pages se met à jour automatiquement (2-3 min)
4. Sur mobile, ferme et rouvre l'app pour voir les changements

---

## ⚠️ Notes Importantes

- **Données locales**: Tes données (XP, quêtes, etc.) sont stockées dans le navigateur de chaque appareil. Elles ne se synchronisent PAS entre appareils.
- **Offline**: L'app fonctionne sans internet une fois installée!
- **HTTPS**: GitHub Pages fournit automatiquement le HTTPS (nécessaire pour la PWA).

---

## 🆘 Problèmes Fréquents

### L'app ne s'installe pas sur mobile
- Assure-toi d'utiliser **Safari** sur iPhone ou **Chrome** sur Android
- L'URL doit être en **HTTPS**

### Les icônes ne s'affichent pas
- Vérifie que le dossier `assets/icons/` contient les images
- Tu peux créer des icônes simples avec [favicon.io](https://favicon.io/)

### Les changements ne s'affichent pas
- Vide le cache du navigateur (Ctrl+Shift+R)
- Désinstalle et réinstalle l'app sur mobile

---

*Bonne chance, Chasseur! 🎮*
