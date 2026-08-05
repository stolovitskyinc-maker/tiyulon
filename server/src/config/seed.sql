-- Trail 1: Ein Gedi (Nahal David)
INSERT INTO trails (name, region, difficulty, estimated_time, shade_level, water_sources, description, map_center_lat, map_center_lng)
VALUES (
  'Ein Gedi — Nahal David',
  'Judean Desert',
  'Easy',
  '1–1.5 hours',
  'Partial',
  TRUE,
  'A short desert oasis trail following a stream up to David''s Waterfall, passing several shaded pools along the way. Family-friendly, with wading pools suitable for kids and archaeological sites dating back thousands of years nearby.',
  31.4618, 35.3822
) RETURNING id;

-- Trail 2: Beit She'arim National Park
INSERT INTO trails (name, region, difficulty, estimated_time, shade_level, water_sources, description, map_center_lat, map_center_lng)
VALUES (
  'Beit She''arim National Park',
  'Lower Galilee',
  'Easy',
  '2–2.5 hours',
  'Partial',
  FALSE,
  'A UNESCO World Heritage necropolis of ancient rock-cut burial caves, once the resting place of Rabbi Judah ha-Nasi and the seat of the Sanhedrin. A flat, easy walk through olive and cypress groves connecting several catacomb complexes.',
  32.7014, 35.1284
) RETURNING id;

-- Trail 3: Nahal Tzipori
INSERT INTO trails (name, region, difficulty, estimated_time, shade_level, water_sources, description, map_center_lat, map_center_lng)
VALUES (
  'Nahal Tzipori',
  'Lower Galilee',
  'Easy',
  '1.5–2 hours',
  'Partial',
  TRUE,
  'A gentle, spring-fed stream trail near the ancient city of Tzipori. The first stretch is a paved, stroller-friendly path, passing a historic watermill ruin and a spring-fed pool once renovated by Carmelite monks.',
  32.7500, 35.2833
) RETURNING id;