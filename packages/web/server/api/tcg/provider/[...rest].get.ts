export default defineCachedEventHandler(async (event) => {
  const reqUrl = getRequestURL(event)

  const pathname = event.context.params!.rest
  return TCGClient.get(pathname, reqUrl.searchParams)
})
