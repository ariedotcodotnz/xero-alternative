import { 
  putJson,
  postJson,
  deleteReq,
  ApiErrorResponse,
  ApiResponseBody 
} from "./config/fetch.api";

interface iIncomeSource {
  financial_income_source: {
    description: string,
    frequency: string,
    recurring_amount: string,
    starts_during_current_fy: boolean,
    start_on: string,
    ending: boolean,
    end_on: string,
    income_source_id: string,
  }
}

interface iUpdateResponse
  extends ApiResponseBody {
    data: {
      message: string;
      financial_income_source: iIncomeSource
    };
  };

interface iCreateResponse
  extends ApiResponseBody {
    data: {
      message: string;
    }
  }

  interface iDeleteResponse
  extends ApiResponseBody {
    data: {
      message: string;
    }
  }

export const updateIncomeSource = async (incomeSourceId: string, body: iIncomeSource): Promise<iUpdateResponse & ApiErrorResponse> =>
  putJson(Routes.api_financial_income_source_path(incomeSourceId), JSON.stringify(body), false)

export const createIncomeSource = async(body: iIncomeSource): Promise<iCreateResponse & ApiErrorResponse> =>
  postJson(Routes.api_financial_income_sources_path(), JSON.stringify(body), false)

export const deleteIncomeSource = async(incomeSourceId: string): Promise<iDeleteResponse & ApiErrorResponse> =>
  deleteReq(Routes.api_financial_income_source_path(incomeSourceId), false)
