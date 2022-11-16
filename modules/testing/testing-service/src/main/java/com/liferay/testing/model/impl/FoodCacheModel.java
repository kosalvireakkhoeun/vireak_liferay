/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.testing.model.impl;

import com.liferay.petra.lang.HashUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.CacheModel;
import com.liferay.testing.model.Food;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

import java.util.Date;

/**
 * The cache model class for representing Food in entity cache.
 *
 * @author Brian Wing Shun Chan
 * @generated
 */
public class FoodCacheModel implements CacheModel<Food>, Externalizable {

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof FoodCacheModel)) {
			return false;
		}

		FoodCacheModel foodCacheModel = (FoodCacheModel)object;

		if (foodId == foodCacheModel.foodId) {
			return true;
		}

		return false;
	}

	@Override
	public int hashCode() {
		return HashUtil.hash(0, foodId);
	}

	@Override
	public String toString() {
		StringBundler sb = new StringBundler(19);

		sb.append("{uuid=");
		sb.append(uuid);
		sb.append(", foodId=");
		sb.append(foodId);
		sb.append(", groupId=");
		sb.append(groupId);
		sb.append(", companyId=");
		sb.append(companyId);
		sb.append(", userId=");
		sb.append(userId);
		sb.append(", userName=");
		sb.append(userName);
		sb.append(", createDate=");
		sb.append(createDate);
		sb.append(", modifiedDate=");
		sb.append(modifiedDate);
		sb.append(", foodname=");
		sb.append(foodname);
		sb.append("}");

		return sb.toString();
	}

	@Override
	public Food toEntityModel() {
		FoodImpl foodImpl = new FoodImpl();

		if (uuid == null) {
			foodImpl.setUuid("");
		}
		else {
			foodImpl.setUuid(uuid);
		}

		foodImpl.setFoodId(foodId);
		foodImpl.setGroupId(groupId);
		foodImpl.setCompanyId(companyId);
		foodImpl.setUserId(userId);

		if (userName == null) {
			foodImpl.setUserName("");
		}
		else {
			foodImpl.setUserName(userName);
		}

		if (createDate == Long.MIN_VALUE) {
			foodImpl.setCreateDate(null);
		}
		else {
			foodImpl.setCreateDate(new Date(createDate));
		}

		if (modifiedDate == Long.MIN_VALUE) {
			foodImpl.setModifiedDate(null);
		}
		else {
			foodImpl.setModifiedDate(new Date(modifiedDate));
		}

		if (foodname == null) {
			foodImpl.setFoodname("");
		}
		else {
			foodImpl.setFoodname(foodname);
		}

		foodImpl.resetOriginalValues();

		return foodImpl;
	}

	@Override
	public void readExternal(ObjectInput objectInput) throws IOException {
		uuid = objectInput.readUTF();

		foodId = objectInput.readLong();

		groupId = objectInput.readLong();

		companyId = objectInput.readLong();

		userId = objectInput.readLong();
		userName = objectInput.readUTF();
		createDate = objectInput.readLong();
		modifiedDate = objectInput.readLong();
		foodname = objectInput.readUTF();
	}

	@Override
	public void writeExternal(ObjectOutput objectOutput) throws IOException {
		if (uuid == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(uuid);
		}

		objectOutput.writeLong(foodId);

		objectOutput.writeLong(groupId);

		objectOutput.writeLong(companyId);

		objectOutput.writeLong(userId);

		if (userName == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(userName);
		}

		objectOutput.writeLong(createDate);
		objectOutput.writeLong(modifiedDate);

		if (foodname == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(foodname);
		}
	}

	public String uuid;
	public long foodId;
	public long groupId;
	public long companyId;
	public long userId;
	public String userName;
	public long createDate;
	public long modifiedDate;
	public String foodname;

}