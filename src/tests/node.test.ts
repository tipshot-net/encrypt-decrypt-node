import request from "supertest";
import app from "../app";
import { utils } from "../services/utils.services";

const sample_tip = {
  start_time: "12345678",
  end_time: "87654321",
  odd: "2.05",
  key: "my_lost_key",
  tips: {},
}

test("it should encrypt new tips data without image", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .field(
      "json_data",
      JSON.stringify(sample_tip)
    )
    .expect(200);
  expect(response.body.key).toBe(utils.encrypt("my_lost_key"));
  expect(response.body.start_time).toBe("12345678");
  expect(response.body.end_time).toBe("87654321");
  expect(response.body.odd).toBe("205");
});

test("it should encrypt new tips data with image", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .field(
      "json_data",
      JSON.stringify(sample_tip)
    )
    .attach("image", __dirname + "/fixtures/avatar.jpeg")
    .expect(200);
  expect(response.body.key).toBe(utils.encrypt("my_lost_key"));
  expect(response.body.start_time).toBe("12345678");
  expect(response.body.end_time).toBe("87654321");
  expect(response.body.odd).toBe("205");
});

test("it should revert if not tips data not valid json", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .send("just any data")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("it reverts if key not set during tip upload", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .field(
      "json_data",
      JSON.stringify({
        start_time: "12345678",
        end_time: "87654321",
        odd: "2.05",
        key: "",
        tips: {},
      })
    )
    .attach("image", __dirname + "/fixtures/avatar.jpeg")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("it reverts if start time not set during tip upload", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .field(
      "json_data",
      JSON.stringify({
        start_time: "",
        end_time: "87654321",
        odd: "2.05",
        key: "my_lost_key",
        tips: {},
      })
    )
    .attach("image", __dirname + "/fixtures/avatar.jpeg")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("it reverts if end time not set during tip upload", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .field(
      "json_data",
      JSON.stringify({
        start_time: "12345678",
        end_time: "",
        odd: "2.05",
        key: "my_lost_key",
        tips: {},
      })
    )
    .attach("image", __dirname + "/fixtures/avatar.jpeg")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("it reverts if odd not set during tip upload", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .field(
      "json_data",
      JSON.stringify({
        start_time: "12345678",
        end_time: "87654321",
        odd: "",
        key: "my_lost_key",
        tips: {},
      })
    )
    .attach("image", __dirname + "/fixtures/avatar.jpeg")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("it reverts if tips data not set during tip upload", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .field(
      "json_data",
      JSON.stringify({
        start_time: "12345678",
        end_time: "87654321",
        odd: "2.05",
        key: "my_lost_key",
        tips: "",
      })
    )
    .attach("image", __dirname + "/fixtures/avatar.jpeg")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});
test("it reverts if address not set during tip upload", async function () {
  const response = await request(app)
    .post("/api/v1/upload-tip")
    .set("Accept", "application/json")
    .field("address", "")
    .field(
      "json_data",
      JSON.stringify({
        start_time: "12345678",
        end_time: "87654321",
        odd: "2.05",
        key: "my_lost_key",
        tips: {},
      })
    )
    .attach("image", __dirname + "/fixtures/avatar.jpeg")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("purchase key is encrypted", async function () {
  const response = await request(app)
    .post("/api/v1/purchase")
    .send({
      id: "1",
      key: "my_key_123",
    })
    .expect(200);
  expect(response.body.id).toBe("1");
  expect(response.body.key).toBe(utils.encrypt("my_key_123"));
});

test("revert on purchase if id not set", async function () {
  const response = await request(app)
    .post("/api/v1/purchase")
    .send({
      id: "",
      key: "my_key_123",
    })
    .expect(400);
  expect(response.body.error).toBe("invalid id");
});

test("revert on purchase if id not integer", async function () {
  const response = await request(app)
    .post("/api/v1/purchase")
    .send({
      id: "one",
      key: "my_key_123",
    })
    .expect(400);
  expect(response.body.error).toBe("invalid id");
});

test("revert on purchase if key not set", async function () {
  const response = await request(app)
    .post("/api/v1/purchase")
    .send({
      id: "1",
      key: "",
    })
    .expect(400);
  expect(response.body.error).toBe("key length too short, min: 6 chars");
});

test("revert on tip view if address not set", async function () {
  const response = await request(app)
    .post("/api/v1/tip/view")
    .send({
      id: "1",
      address: "",
    })
    .expect(400);
  expect(response.body.error).toBe("Invalid input parameters");
});

test("revert on tip view if id not set", async function () {
  const response = await request(app)
    .post("/api/v1/tip/view")
    .send({
      id: "",
      address: "test_0x4919B45b005058Fabc63AC2da39f7859eDeD9271",
    })
    .expect(400);
  expect(response.body.error).toBe("Invalid input parameters");
});

test("return null if tip isn't purchased", async function () {
  const response = await request(app)
    .post("/api/v1/tip/view")
    .send({
      id: "1",
      address: "0x4919B45b005058Fabc63AC2da39f7859eDeD9271",
    })
    .expect(404);
  expect(response.body.data).toBe(null);
});

test("reverts if invalid json data on profile creation", async function () {
  const response = await request(app)
    .post("/api/v1/profile/create")
    .send("random string")
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("reverts if address non-existent on profile creation", async function () {
  const response = await request(app)
    .post("/api/v1/profile/create")
    .send({
      address: "",
      data: {
        name: "rick",
        sport: "football",
      },
    })
    .expect(400);
  expect(response.body.error).toBe("Invalid json data");
});

test("encrypts profile data", async function () {
  const response = await request(app)
    .post("/api/v1/profile/create")
    .send({
      address: "0x4919B45b005058Fabc63AC2da39f7859eDeD9271",
      data: {
        name: "rick",
        sport: "football",
      },
    })
    .expect(200);
});

test("returns null if empty profile on profile view", async function () {
  const response = await request(app)
    .get("/api/v1/profile/0xc4Ed33B15E7bE1A427D075C1c43c6c7F8923f433")
    .expect(404);
  expect(response.body.message).toBe("No profile data found");
});

test("returns decrypted profile data on profile view", async function () {
  const response = await request(app)
    .get("/api/v1/profile/0x4919B45b005058Fabc63AC2da39f7859eDeD9271")
    .expect(200);
  expect(response.body.data).toMatchObject({
    address: "0x4919B45b005058Fabc63AC2da39f7859eDeD9271",
    data: {
      name: "rick",
      sport: "football",
    },
  });
});

test("return decrypted tip if purchased", async function () {
  const response = await request(app)
    .post("/api/v1/tip/view")
    .send({
      id: "1",
      address: "0x8ae0C30C5FBC78e242815cf202A534af643771aa",
      key: "my_purchase_key",
    })
    .expect(200);
  expect(response.body).toMatchObject({
    "data": sample_tip
  });
});

test("return decrypted tip if owner", async function () {
  const response = await request(app)
    .post("/api/v1/tip/view")
    .send({
      id: "1",
      address: "0x4919B45b005058Fabc63AC2da39f7859eDeD9271",
      key: "my_key_123",
    })
    .expect(200);
  expect(response.body).toMatchObject({
    "data": sample_tip
  });
});
