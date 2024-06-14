import { prismaIncludeParamParser } from '@/.';
import { describe, expect, it } from 'bun:test';


describe('prismaIncludeParamParser', () => {
  it('should return null for empty input array', () => {
    expect(prismaIncludeParamParser([])).toBeNull();
  });

  it('should handle single-level includes correctly', () => {
    const includes = ["user", "posts"];
    expect(prismaIncludeParamParser(includes)).toEqual({ user: true, posts: true });
  });

  it('should handle nested includes correctly', () => {
    const includes = ["user.profile", "posts.comments"];
    expect(prismaIncludeParamParser(includes)).toEqual({
      user: { include: { profile: true } },
      posts: { include: { comments: true } }
    });
  });

  it('should handle complex nested includes correctly', () => {
    const includes = ["user.profile", "user.settings", "posts.comments", "posts.comments.author"];
    expect(prismaIncludeParamParser(includes)).toEqual({
      user: {
        include: {
          profile: true,
          settings: true
        }
      },
      posts: {
        include: {
          comments: {
            include: {
              author: true
            }
          }
        }
      }
    });
  });
});
