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

package com.liferay.testing.model;

import com.liferay.exportimport.kernel.lar.StagedModelType;
import com.liferay.portal.kernel.model.ModelWrapper;
import com.liferay.portal.kernel.model.wrapper.BaseModelWrapper;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * This class is a wrapper for {@link Food}.
 * </p>
 *
 * @author Brian Wing Shun Chan
 * @see Food
 * @generated
 */
public class FoodWrapper
	extends BaseModelWrapper<Food> implements Food, ModelWrapper<Food> {

	public FoodWrapper(Food food) {
		super(food);
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("uuid", getUuid());
		attributes.put("foodId", getFoodId());
		attributes.put("groupId", getGroupId());
		attributes.put("companyId", getCompanyId());
		attributes.put("userId", getUserId());
		attributes.put("userName", getUserName());
		attributes.put("createDate", getCreateDate());
		attributes.put("modifiedDate", getModifiedDate());
		attributes.put("foodname", getFoodname());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		String uuid = (String)attributes.get("uuid");

		if (uuid != null) {
			setUuid(uuid);
		}

		Long foodId = (Long)attributes.get("foodId");

		if (foodId != null) {
			setFoodId(foodId);
		}

		Long groupId = (Long)attributes.get("groupId");

		if (groupId != null) {
			setGroupId(groupId);
		}

		Long companyId = (Long)attributes.get("companyId");

		if (companyId != null) {
			setCompanyId(companyId);
		}

		Long userId = (Long)attributes.get("userId");

		if (userId != null) {
			setUserId(userId);
		}

		String userName = (String)attributes.get("userName");

		if (userName != null) {
			setUserName(userName);
		}

		Date createDate = (Date)attributes.get("createDate");

		if (createDate != null) {
			setCreateDate(createDate);
		}

		Date modifiedDate = (Date)attributes.get("modifiedDate");

		if (modifiedDate != null) {
			setModifiedDate(modifiedDate);
		}

		String foodname = (String)attributes.get("foodname");

		if (foodname != null) {
			setFoodname(foodname);
		}
	}

	@Override
	public Food cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	/**
	 * Returns the company ID of this food.
	 *
	 * @return the company ID of this food
	 */
	@Override
	public long getCompanyId() {
		return model.getCompanyId();
	}

	/**
	 * Returns the create date of this food.
	 *
	 * @return the create date of this food
	 */
	@Override
	public Date getCreateDate() {
		return model.getCreateDate();
	}

	/**
	 * Returns the food ID of this food.
	 *
	 * @return the food ID of this food
	 */
	@Override
	public long getFoodId() {
		return model.getFoodId();
	}

	/**
	 * Returns the foodname of this food.
	 *
	 * @return the foodname of this food
	 */
	@Override
	public String getFoodname() {
		return model.getFoodname();
	}

	/**
	 * Returns the group ID of this food.
	 *
	 * @return the group ID of this food
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the modified date of this food.
	 *
	 * @return the modified date of this food
	 */
	@Override
	public Date getModifiedDate() {
		return model.getModifiedDate();
	}

	/**
	 * Returns the primary key of this food.
	 *
	 * @return the primary key of this food
	 */
	@Override
	public long getPrimaryKey() {
		return model.getPrimaryKey();
	}

	/**
	 * Returns the user ID of this food.
	 *
	 * @return the user ID of this food
	 */
	@Override
	public long getUserId() {
		return model.getUserId();
	}

	/**
	 * Returns the user name of this food.
	 *
	 * @return the user name of this food
	 */
	@Override
	public String getUserName() {
		return model.getUserName();
	}

	/**
	 * Returns the user uuid of this food.
	 *
	 * @return the user uuid of this food
	 */
	@Override
	public String getUserUuid() {
		return model.getUserUuid();
	}

	/**
	 * Returns the uuid of this food.
	 *
	 * @return the uuid of this food
	 */
	@Override
	public String getUuid() {
		return model.getUuid();
	}

	@Override
	public void persist() {
		model.persist();
	}

	/**
	 * Sets the company ID of this food.
	 *
	 * @param companyId the company ID of this food
	 */
	@Override
	public void setCompanyId(long companyId) {
		model.setCompanyId(companyId);
	}

	/**
	 * Sets the create date of this food.
	 *
	 * @param createDate the create date of this food
	 */
	@Override
	public void setCreateDate(Date createDate) {
		model.setCreateDate(createDate);
	}

	/**
	 * Sets the food ID of this food.
	 *
	 * @param foodId the food ID of this food
	 */
	@Override
	public void setFoodId(long foodId) {
		model.setFoodId(foodId);
	}

	/**
	 * Sets the foodname of this food.
	 *
	 * @param foodname the foodname of this food
	 */
	@Override
	public void setFoodname(String foodname) {
		model.setFoodname(foodname);
	}

	/**
	 * Sets the group ID of this food.
	 *
	 * @param groupId the group ID of this food
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	/**
	 * Sets the modified date of this food.
	 *
	 * @param modifiedDate the modified date of this food
	 */
	@Override
	public void setModifiedDate(Date modifiedDate) {
		model.setModifiedDate(modifiedDate);
	}

	/**
	 * Sets the primary key of this food.
	 *
	 * @param primaryKey the primary key of this food
	 */
	@Override
	public void setPrimaryKey(long primaryKey) {
		model.setPrimaryKey(primaryKey);
	}

	/**
	 * Sets the user ID of this food.
	 *
	 * @param userId the user ID of this food
	 */
	@Override
	public void setUserId(long userId) {
		model.setUserId(userId);
	}

	/**
	 * Sets the user name of this food.
	 *
	 * @param userName the user name of this food
	 */
	@Override
	public void setUserName(String userName) {
		model.setUserName(userName);
	}

	/**
	 * Sets the user uuid of this food.
	 *
	 * @param userUuid the user uuid of this food
	 */
	@Override
	public void setUserUuid(String userUuid) {
		model.setUserUuid(userUuid);
	}

	/**
	 * Sets the uuid of this food.
	 *
	 * @param uuid the uuid of this food
	 */
	@Override
	public void setUuid(String uuid) {
		model.setUuid(uuid);
	}

	@Override
	public StagedModelType getStagedModelType() {
		return model.getStagedModelType();
	}

	@Override
	protected FoodWrapper wrap(Food food) {
		return new FoodWrapper(food);
	}

}