# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - img "Illustration" [ref=e4]
    - generic [ref=e5]:
      - heading "Espace Admin" [level=1] [ref=e6]
      - generic [ref=e7]:
        - generic [ref=e8]:
          - img [ref=e10]
          - textbox "Email admin" [ref=e13]: admin-change@example.com
        - generic [ref=e14]:
          - img [ref=e16]
          - textbox "Mot de passe" [ref=e19]: Admin!234
          - button [ref=e20] [cursor=pointer]:
            - img [ref=e21]
        - button "En cours…" [disabled] [ref=e24] [cursor=pointer]:
          - generic [ref=e26]: En cours…
      - button "Retour au site" [ref=e28] [cursor=pointer]:
        - generic [ref=e29]: Retour au site
  - generic [ref=e34] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e35]:
      - img [ref=e36]
    - generic [ref=e40]:
      - button "Open issues overlay" [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]: "0"
          - generic [ref=e44]: "1"
        - generic [ref=e45]: Issue
      - button "Collapse issues badge" [ref=e46]:
        - img [ref=e47]
  - alert [ref=e49]
```