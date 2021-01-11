import Ajv from 'ajv';
import AjvKeywords from 'ajv-keywords';
// ajv-errors needed for errorMessage
import AjvErrors from 'ajv-errors';

const ajv = new Ajv.default({ allErrors: true });

AjvKeywords(ajv, "regexp");
AjvErrors(ajv);

// modification of regex by requiring Z https://www.regextester.com/97766
const ISO8601UTCRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?Z$/;

ajv.addFormat('date-time-utc', {
  validate: (dateTimeString) => ISO8601UTCRegex.test(dateTimeString)
});

const typeISO8601UTC = {
  "type": "string",
  "regexp": ISO8601UTCRegex.toString(),
  "errorMessage": "must be string of format 1970-01-01T00:00:00Z. Got ${0}",
};

const dateTypeUtc = {
  "type": "string",
  "format": "date-time-utc",
  "errorMessage": "must be string of format 1970-01-01T00:00:00Z. Got ${0}",
};

const schema = {
  type: "object",
  properties: {
    foo: { type: "number", minimum: 0 },
    timestamp: typeISO8601UTC,
    timestamp2: dateTypeUtc,
  },
  required: ["foo", "timestamp"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

const data = { foo: 1, timestamp: "2020-01-11T20:28:00Z", timestamp2: "2020-01-11T20:28:00Z" }

if (validate(data)) {
  console.log(JSON.stringify(data, null, 2));
} else {
  console.log(JSON.stringify(validate.errors, null, 2));
}
