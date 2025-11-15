# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - img "Illustration" [ref=e4]
    - generic [ref=e5]:
      - heading "Connexion" [level=1] [ref=e6]
      - generic [ref=e7]:
        - generic [ref=e8]:
          - img [ref=e10]
          - textbox "Votre email" [ref=e13]
        - generic [ref=e14]:
          - img [ref=e16]
          - textbox "Mot de passe" [ref=e19]
          - button [ref=e20] [cursor=pointer]:
            - img [ref=e21]
        - button "Se connecter" [ref=e24] [cursor=pointer]:
          - generic [ref=e25]: Se connecter
      - generic [ref=e26]:
        - button "Créer un compte" [ref=e27] [cursor=pointer]:
          - generic [ref=e28]: Créer un compte
        - button "Mot de passe oublié ?" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: Mot de passe oublié ?
  - button "Open Next.js Dev Tools" [ref=e36] [cursor=pointer]:
    - img [ref=e37]
  - alert [ref=e40]
```