import { NextResponse } from "next/server";

export function apiSuccess(data, message = "OK", init = {}) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    init,
  );
}

export function apiError(message = "Internal Server Error", status = 500) {
  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
    },
    { status },
  );
}
