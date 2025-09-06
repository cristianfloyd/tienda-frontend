/**
 * @jest-environment node
 */
import { WordPressAPI } from '../../src/lib/wordpress-api'
import { mockWordPressPosts, mockWordPressCategories } from '../__mocks__/wordpress-api-responses'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock environment variables
const originalEnv = process.env
beforeEach(() => {
  jest.resetModules()
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_WORDPRESS_URL: 'https://test-wordpress.com'
  }
  mockFetch.mockClear()
})

afterEach(() => {
  process.env = originalEnv
})

describe('WordPressAPI', () => {
  let wpAPI: WordPressAPI

  beforeEach(() => {
    wpAPI = new WordPressAPI('https://test-wordpress.com')
  })

  describe('constructor', () => {
    it('removes trailing slash from baseUrl', () => {
      const apiWithTrailingSlash = new WordPressAPI('https://test-wordpress.com/')
      expect(apiWithTrailingSlash['baseUrl']).toBe('https://test-wordpress.com')
    })
  })

  describe('getPosts', () => {
    it('fetches posts successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWordPressPosts
      })

      const posts = await wpAPI.getPosts()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-wordpress.com/wp-json/wp/v2/posts?',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
      expect(posts).toEqual(mockWordPressPosts)
    })

    it('fetches posts with parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWordPressPosts
      })

      await wpAPI.getPosts({ per_page: '5', status: 'publish' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-wordpress.com/wp-json/wp/v2/posts?per_page=5&status=publish',
        expect.any(Object)
      )
    })

    it('throws error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      })

      await expect(wpAPI.getPosts()).rejects.toThrow('WordPress API error: Not Found')
    })
  })

  describe('getPost', () => {
    it('fetches single post successfully', async () => {
      const singlePost = mockWordPressPosts[0]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => singlePost
      })

      const post = await wpAPI.getPost(1)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-wordpress.com/wp-json/wp/v2/posts/1',
        expect.any(Object)
      )
      expect(post).toEqual(singlePost)
    })
  })

  describe('getCategories', () => {
    it('fetches categories successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWordPressCategories
      })

      const categories = await wpAPI.getCategories()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-wordpress.com/wp-json/wp/v2/categories?',
        expect.any(Object)
      )
      expect(categories).toEqual(mockWordPressCategories)
    })
  })

  describe('error handling', () => {
    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(wpAPI.getPosts()).rejects.toThrow('Network error')
    })

    it('handles non-JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      await expect(wpAPI.getPosts()).rejects.toThrow('Invalid JSON')
    })
  })
})