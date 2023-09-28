export default function truncateProduct(str) {
  return str
  	.split(";")[0]
  	.split(", or")[0]
  	.split(", other")[0]
  	.split(", not")[0];
}