require "test_helper"

class HealthControllerTest < ActionDispatch::IntegrationTest
  test "should return ok status" do
    get health_index_url

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal "ok", body["status"]
  end
end
