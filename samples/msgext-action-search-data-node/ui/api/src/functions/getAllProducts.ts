import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import IProduct from "../../Model/IProduct";
import { getOrders } from "../../services/azServices";

export async function getAllProducts(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // Initialize response.
  const res: HttpResponseInit = {
    status: 200
  };
  const body = Object();

  let products: IProduct[];
  if (req.query.size === 0 || req.query.get('category') === 'All') {
    products = await getOrders('');
  }
  else {
    const srchStr = req.query.get('category');
    products = await getOrders(srchStr);
  }

  
  res.body = JSON.stringify(products);
  return res; 
}

app.http("getAllProducts", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: getAllProducts
});
