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

import com.liferay.portal.kernel.bean.AutoEscape;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.GroupedModel;
import com.liferay.portal.kernel.model.ShardedModel;
import com.liferay.portal.kernel.model.StagedAuditedModel;

import java.util.Date;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The base model interface for the Food service. Represents a row in the &quot;FOOD_Food&quot; database table, with each column mapped to a property of this class.
 *
 * <p>
 * This interface and its corresponding implementation <code>com.liferay.testing.model.impl.FoodModelImpl</code> exist only as a container for the default property accessors generated by ServiceBuilder. Helper methods and all application logic should be put in <code>com.liferay.testing.model.impl.FoodImpl</code>.
 * </p>
 *
 * @author Brian Wing Shun Chan
 * @see Food
 * @generated
 */
@ProviderType
public interface FoodModel
	extends BaseModel<Food>, GroupedModel, ShardedModel, StagedAuditedModel {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. All methods that expect a food model instance should use the {@link Food} interface instead.
	 */

	/**
	 * Returns the primary key of this food.
	 *
	 * @return the primary key of this food
	 */
	public long getPrimaryKey();

	/**
	 * Sets the primary key of this food.
	 *
	 * @param primaryKey the primary key of this food
	 */
	public void setPrimaryKey(long primaryKey);

	/**
	 * Returns the uuid of this food.
	 *
	 * @return the uuid of this food
	 */
	@AutoEscape
	@Override
	public String getUuid();

	/**
	 * Sets the uuid of this food.
	 *
	 * @param uuid the uuid of this food
	 */
	@Override
	public void setUuid(String uuid);

	/**
	 * Returns the food ID of this food.
	 *
	 * @return the food ID of this food
	 */
	public long getFoodId();

	/**
	 * Sets the food ID of this food.
	 *
	 * @param foodId the food ID of this food
	 */
	public void setFoodId(long foodId);

	/**
	 * Returns the group ID of this food.
	 *
	 * @return the group ID of this food
	 */
	@Override
	public long getGroupId();

	/**
	 * Sets the group ID of this food.
	 *
	 * @param groupId the group ID of this food
	 */
	@Override
	public void setGroupId(long groupId);

	/**
	 * Returns the company ID of this food.
	 *
	 * @return the company ID of this food
	 */
	@Override
	public long getCompanyId();

	/**
	 * Sets the company ID of this food.
	 *
	 * @param companyId the company ID of this food
	 */
	@Override
	public void setCompanyId(long companyId);

	/**
	 * Returns the user ID of this food.
	 *
	 * @return the user ID of this food
	 */
	@Override
	public long getUserId();

	/**
	 * Sets the user ID of this food.
	 *
	 * @param userId the user ID of this food
	 */
	@Override
	public void setUserId(long userId);

	/**
	 * Returns the user uuid of this food.
	 *
	 * @return the user uuid of this food
	 */
	@Override
	public String getUserUuid();

	/**
	 * Sets the user uuid of this food.
	 *
	 * @param userUuid the user uuid of this food
	 */
	@Override
	public void setUserUuid(String userUuid);

	/**
	 * Returns the user name of this food.
	 *
	 * @return the user name of this food
	 */
	@AutoEscape
	@Override
	public String getUserName();

	/**
	 * Sets the user name of this food.
	 *
	 * @param userName the user name of this food
	 */
	@Override
	public void setUserName(String userName);

	/**
	 * Returns the create date of this food.
	 *
	 * @return the create date of this food
	 */
	@Override
	public Date getCreateDate();

	/**
	 * Sets the create date of this food.
	 *
	 * @param createDate the create date of this food
	 */
	@Override
	public void setCreateDate(Date createDate);

	/**
	 * Returns the modified date of this food.
	 *
	 * @return the modified date of this food
	 */
	@Override
	public Date getModifiedDate();

	/**
	 * Sets the modified date of this food.
	 *
	 * @param modifiedDate the modified date of this food
	 */
	@Override
	public void setModifiedDate(Date modifiedDate);

	/**
	 * Returns the foodname of this food.
	 *
	 * @return the foodname of this food
	 */
	@AutoEscape
	public String getFoodname();

	/**
	 * Sets the foodname of this food.
	 *
	 * @param foodname the foodname of this food
	 */
	public void setFoodname(String foodname);

	@Override
	public Food cloneWithOriginalValues();

}