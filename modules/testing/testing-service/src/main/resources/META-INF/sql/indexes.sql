create index IX_F61E1285 on FOOD_Food (groupId);
create index IX_3D164A79 on FOOD_Food (uuid_[$COLUMN_LENGTH:75$], companyId);
create unique index IX_4E711B3B on FOOD_Food (uuid_[$COLUMN_LENGTH:75$], groupId);