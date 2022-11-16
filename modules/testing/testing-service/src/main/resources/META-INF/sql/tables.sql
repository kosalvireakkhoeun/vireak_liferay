create table FOOD_Food (
	uuid_ VARCHAR(75) null,
	foodId LONG not null primary key,
	groupId LONG,
	companyId LONG,
	userId LONG,
	userName VARCHAR(75) null,
	createDate DATE null,
	modifiedDate DATE null,
	foodname VARCHAR(75) null
);