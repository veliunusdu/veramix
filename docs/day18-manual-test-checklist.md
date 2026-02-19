# Day 18 Manual Test Checklist

Date: 2026-02-19

## Preconditions

- Development server is running: `npm run dev`
- At least one `ADMIN` user exists
- At least one `VIEWER` (or logged-out session) is available for negative auth checks
- At least one `PUBLISHED` product exists
- At least one `DRAFT` product exists (example: `taslak-urun`)

## 1) Unauthorized user tries to access admin

- [ ] Open `/admin/products` while logged out
- [ ] Expected: browser is redirected to `/login`
- [ ] Log in as non-admin user and open `/admin/products`
- [ ] Expected: browser is redirected to `/unauthorized`

## 2) Draft product is hidden from storefront

- [ ] Open `/products/taslak-urun` (or another DRAFT slug)
- [ ] Expected: page returns not found state (`404`)
- [ ] Open `/products`
- [ ] Expected: DRAFT product card is not listed

## 3) Search returns empty state

- [ ] Open `/products?search=zzzzzz-not-found-zzzzzz`
- [ ] Expected: empty-state text is shown: `Ürün bulunamadı.`
- [ ] No product cards should be visible

## 4) Image upload failure shows user-facing error

- [ ] Open `/admin/products/{id}/edit`
- [ ] Try uploading an unsupported file (for example `.txt`) in image upload area
- [ ] Expected: error text appears in uploader (red message)
- [ ] Expected message example: `Sadece jpg, png, webp, gif desteklenir`

## Notes

- Upload errors are user-safe on UI and detailed errors are written to server logs through `lib/logger.ts`.
- If a test fails, capture:
  - URL
  - User role/session state
  - Observed vs expected behavior
