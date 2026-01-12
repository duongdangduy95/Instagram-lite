-- Normalize share posts to avoid duplicating media from the original blog.
-- Rationale:
-- - Share posts should render original media via `sharedFrom`.
-- - If original is deleted (soft delete), share should show placeholder.
-- - Avoid any future risk of deleting original media by manipulating share rows.

UPDATE "Blog"
SET
  "imageUrls" = '{}',
  "hashtags" = '{}',
  "music" = NULL
WHERE "sharedFromId" IS NOT NULL;

