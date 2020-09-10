export default function blockDefinition(blockHash) {
  let blockIndex = 0;
  if (blockHash === "klmnop614") {
    blockIndex = 1;
  } else if (blockHash === "lmnop6715") {
    blockIndex = 2;
  } else if (blockHash === "jklmnop13") {
    blockIndex = 3;
  }

  return blockIndex;
}
