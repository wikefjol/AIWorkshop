import '@testing-library/jest-dom'

// jsdom does not implement EventSource — stub it so useSSE doesn't throw in tests
class MockEventSource {
  addEventListener() {}
  removeEventListener() {}
  close() {}
}
global.EventSource = MockEventSource as unknown as typeof EventSource
