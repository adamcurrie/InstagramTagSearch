DROP TABLE IF EXISTS MEDIA;
DROP TABLE IF EXISTS TAGS;
DROP DOMAIN IF EXISTS MEDIA_TYPE;

CREATE TABLE TAGS (
  ID BIGSERIAL PRIMARY KEY,
  NAME TEXT NOT NULL,
  START_DATE BIGINT NOT NULL,
  END_DATE BIGINT NOT NULL,
  MIN_TAG_ID BIGINT NOT NULL,
  MAX_TAG_ID BIGINT NOT NULL
);

CREATE DOMAIN MEDIA_TYPE AS TEXT
CONSTRAINT VALID_MEDIA_TYPE CHECK (
  VALUE IN ('image', 'video')
);

CREATE TABLE MEDIA (
  ID BIGSERIAL PRIMARY KEY,
  TAG_ID BIGSERIAL REFERENCES TAGS(ID),
  CREATED_TIME BIGINT NOT NULL,
  MEDIA_TYPE MEDIA_TYPE NOT NULL,
  MEDIA_URL TEXT NOT NULL,
  INSTAGRAM_URL TEXT NOT NULL,
  USERNAME TEXT NOT NULL
);

CREATE INDEX TAG_SEARCH ON MEDIA(TAG_ID);