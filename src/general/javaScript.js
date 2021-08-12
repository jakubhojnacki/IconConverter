/**
 * @module JavaScript extensions
 * @description A series of useful language extensions
 * @version 0.0.7 (2021-08-12)
 */

Array.isNonEmpty = function(pArray) {
	return ((pArray != null) && (Array.isArray(pArray)) && (pArray.length > 0));
}

Array.nonEmpty = function(pValue, pDefault) {
	return Array.isNonEmpty(pValue) ? pValue : pDefault;
}

Array.validate = function(pInput, pDefaultValue, pAllowNull) {
	let value = null;
	if (pInput != null) {
		if (Array.isArray(pInput))
			value = pInput;
		if (value == null)
			Object.raiseTypeError(pInput, this.name);
	} else if (!pAllowNull)
		value = pDefaultValue != null ? pDefaultValue : [];
	return value;
}

Array.prototype.clone = function() {
	return this.slice(0);
};

Array.prototype.contains = function(pItem){
    return (this.indexOf(pItem) >= 0);
};

Boolean.validate = function(pInput, pDefaultValue, pAllowNull) {
	let value = null;
	if (pInput != null) {
		switch (typeof(pInput)) {
			case "boolean":
				value = pInput;
				break;
			case "number":
				if (pInput === 1)
					value = true;
				else if (pInput === 0)
					value = false;
				break;
			case "string": {
					const string = pInput.trim().toLowerCase();
					switch (string) {
						case "true": 
							value = true;
							break;
						case "false": 
							value = false;
							break;
					}
				} break;
		}
		if (value == null)
			Object.raiseTypeError(pInput, this.name);
	} else if (!pAllowNull)
		value = pDefaultValue != null ? pDefaultValue : false;
	return value;
}

Date.validate = function(pInput, pDefaultValue, pAllowNull) {
	let value = null;
	if (pInput != null) {
		const typeOf = typeof(pInput);
		switch (typeOf) {
			case "object":
				if (pInput instanceof Date)
					value = pInput;
				break;
			case "number": {
					value = new Date();
					value.setTime(pInput);
				} break;
			case "string": {
					value = new Date();
					value.setTime(Date.parse(pInput));
				}
				break;
		}
		if (value == null)
			Object.raiseTypeError(pInput, this.name);
	} else if (!pAllowNull)
		value = pDefaultValue != null ? pDefaultValue : new Date();
	return value;
}

Date.createTimeStamp = function() {
	return (new Date()).toTimeStamp();
}

Date.createFileTimeStamp = function() {
	return (new Date()).toFileTimeStamp();
}

Date.isDate = function(pValue) {
	return pValue instanceof Date;
}

Date.prototype.format = function(pPattern) {
	let string = pPattern;
	string = string.replace("yyyy", this.getFullYear().pad(4));
	string = string.replace("yy", this.getFullYear().pad(4).substr(2));
	string = string.replace("MM", (this.getMonth() + 1).pad(2));
	string = string.replace("dd", this.getDate().pad(2));
	string = string.replace("hh", this.getHours().pad(2));
	string = string.replace("mm", this.getMinutes().pad(2));
	string = string.replace("ss", this.getSeconds().pad(2));
	string = string.replace("zzz", this.getMilliseconds().pad(3));
	return string;
}

Date.prototype.toFriendlyDateString = function() {
	return this.format("yyyy-MM-dd");
}

Date.prototype.toFriendlyDateTimeString = function() {
	return this.format("yyyy-MM-dd hh:mm:ss");
}

Date.prototype.toTimeStamp = function() {
	return this.format("yyyyMMddhhmmsszzz");
}

Date.prototype.toFileTimeStamp = function() {
	return this.format("yyyyMMdd.hhmm");
}

Number.compare = function(pNumber) {
	let result = 0;
	const thisValue = this.valueof();
	if (thisValue > pNumber)
		result = 1
	else if (thisValue < pNumber)
		result = -1;
	return result;
}

Number.prototype.formatWithLeadingZeros = function(pLength) {
    let result = this.valueOf().toString();
    const length = Number.validate(pLength, 0);
    if (length > 0) {
        const noOfZeros = pLength - result.length;
        if (noOfZeros > 0)
            result = "0".repeat(noOfZeros) + result;
    }
    return result;
}

Number.nonEmpty = function(pValue, pDefault) {
	return pValue !== 0 ? pValue : pDefault;
}

Number.prototype.pad = function(pLength) 
{
	const string = "0".repeat(pLength) + this.valueOf();
	return string.substr(string.length - pLength);
}

Number.validate = function(pInput, pDefaultValue, pAllowNull) {
	let value = null;
	if (pInput != null) {
		switch (typeof(pInput)) {
			case "number":
				value = pInput;
				break;
			case "string":
				value = Number.parseFloat(pInput);
				break;
		}
		if (value == null)
			Object.raiseTypeError(pValue, this.name);
	} else if (!pAllowNull)
		value = pDefaultValue != null ? pDefaultValue : 0;
	return value;
}

Number.validateAsInteger = function(pInput, pDefaultValue, pAllowNull) {
	let value = null;
	if (pInput != null) {
		switch (typeof(pInput)) {
			case "number":
				if (Number.isInteger(pInput))
					value = pInput;
				break;
			case "string":
				value = Number.parseInt(pInput);
				break;
		}
		if (value == null)
			Object.raiseTypeError(pValue, this.name);
	} else if (!pAllowNull)
		value = pDefaultValue != null ? pDefaultValue : 0;
	return value;
}

Object.raiseTypeError = function(pValue, pTypeName) {
	throw new Error(`${Object.toString(pValue)} is not ${pTypeName.toLowerCase()}.`);
}

Object.raiseNullError = function(pTypeName) {
	throw new Error(`${pTypeName} cannot be null.`);
}

Object.isFunction = function(pValue) {
	return (typeof(pValue) === "function");
}

Object.isValueType = function(pValue) {
	return ((typeof(pValue) !== "object") || (pValue instanceof String) || (pValue instanceof Number) || (pValue instanceof Boolean) ||
		(pValue instanceof Date));
}

Object.validate = function(pInput, pDefaultValue, pAllowNull) {
	let value = null;
	if (pInput != null) {
		if (typeof(pInput) === "object")
			value = pInput;
		if (value == null)
			Object.raiseTypeError(pValue, this.name);
	} else if (!pAllowNull)
		value = pDefaultValue != null ? pDefaultValue : {};
	return value;
}

Object.toString = function(pValue) {
	const type = typeof(pValue);
	let string = "";
	if (pValue != null)
		switch (type) {
			case "undefined":
			case "null":
			case "boolean":
			case "number":
			case "bigint":
			case "string":
				string = new String(pValue).valueOf();
				break;
			case "object":
				if (pValue instanceof Date)
					string = pValue.toISOString();
				else
					if ("toString" in pValue)
						string = pValue.toString();
					else
						string = new String(pValue).valueOf();
				break;
		}
	return string;
}

Object.prototype.clone = function() {
	let cloned = new Object();
	for (const property in this)
		cloned[property] = this[property];
	return cloned;
}

Object.prototype.merge = function(pObject, pOverwrite) {
	if (pObject != null)
		for (const property in pObject) {
			const set = pOverwrite ? true : (!(property in this));
			if (set) 
				this[property] = pObject[property];
		}
	return this;
}

String.nonEmpty = function(pValue, pDefault) {
	return pValue ? pValue : pDefault;
}

String.validate = function(pInput, pDefaultValue, pAllowNull) {
	let value = null;
	if (pInput != null) {
		if (typeof(pInput) === "string")
			value = pInput;
		else
			value = Object.toString(pInput);
	} else if (!pAllowNull)
		value = pDefaultValue != null ? pDefaultValue : "";
	return value;
}

String.prototype.append = function(pPart, pPrefix, pSuffix) {
	let newString = this.valueOf();
	if ((newString) && (pPart)) {
		newString += pPrefix != null ? pPrefix : "";
		newString += pPart;
		newString += pSuffix != null ? pSuffix : "";
	}
	return newString;
}

String.prototype.removeIfStartsWith = function(pPart) {
	let newString = this.valueOf();
	if ((this) && (pPart))
		if (this.substr(0, pPart.length) === pPart)
			newString = this.substr(pPart.length);
	return newString;
}

String.prototype.removeIfEndsWith = function(pPart) {
	let newString = this.valueOf();
	if ((newString) && (pPart))
		if (this.substr(this.length - pPart.length) === pPart)
			newString = this.substr(0, this.length - pPart.length);
	return newString;
}

String.prototype.replaceAll = function(pFind, pReplace) {
	return this.replace(new RegExp(pFind, 'g'), pReplace);
}