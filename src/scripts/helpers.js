export function getNameTime(datastream, feature, time_field = "phenomenonTime") {
  
  var name = clean(datastream.properties.ObservedProperty.name);

  if (feature.properties[time_field].includes("/")) {
    const splitTime = feature.properties[time_field].split("/");
    var timeDifference =
      new Date(splitTime[1]).getTime() - new Date(splitTime[0]).getTime();
    var minuteDifference = Math.floor(timeDifference / (1000 * 60));
    var hourDifference = Math.floor(timeDifference / (1000 * 3600));

    if (hourDifference > 0) {
      name = `${name} (${hourDifference} hr)`;
    } else if (minuteDifference > 0) {
      name = `${name} (${minuteDifference} min)`;
    }
  }

  return name;
}

export function clean(word) {
  if (typeof word === "string") {
    if (word.search(/\d+$/) > -1) {
      // String ends with a number
      var endingNumber = word.match(/\d+$/g);
      word = word.replace(endingNumber, `_${endingNumber}`);
    }

    if (word.search(/^\d+/) > -1) {
      // String starts with a number
      var leadingNumber = word.match(/^\d+/g);
      word = word.replace(leadingNumber, `${leadingNumber}_`);
    } else {
      word = word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    }

    return word.replaceAll("_", " ");
  }
}

export function hasLinks(feature) {
  return feature && feature.properties.Datastreams && feature.properties.Datastreams.length > 0;
}
