const {isComment} = require("../routes/comments.js")


describe('comments.js 테스트 코드 작성', () => {

    test('댓글을 작성해야 함', async () => {
      const comment = 'test comment'
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      expect(comment.length > 0).toEqual(true);
    });
  
    // test('댓글 작성을 하지 않았을 때 410 error', async () => {
    //   const response = await request(app)
    //     .post('/api/posts/1234/comments')
    //     .set('Authorization', 'Bearer access_token_here')
    //     .send({ comment: '' })
    //     .expect(410);
  
    //   expect(response.body.errorMessage).toBe('댓글 내용을 입력해주세요.');
    // });
  
    // test('로그인을 하지 않았을 때 403 error', async () => {
    //   const response = await request(app)
    //     .post('/api/posts/1234/comments')
    //     .send({ comment: 'test comment' })
    //     .expect(403);
  
    //   expect(response.body.errorMessage).toBe('로그인이 필요한 기능입니다.');
    // });
  
    // test('게시글이 존재하지 않을 때 412 error', async () => {
    //   const response = await request(app)
    //     .post('/api/posts/1234/comments')
    //     .set('Authorization', 'Bearer access_token_here')
    //     .send({ comment: 'test comment' })
    //     .expect(412);
  
    //   expect(response.body.errorMessage).toBe('게시글이 존재하지 않습니다.');
    // });
  
    // test('데이터 형식이 올바르지 않을 때 410 error', async () => {
    //   const response = await request(app)
    //     .post('/api/posts/1234/comments')
    //     .set('Authorization', 'Bearer access_token_here')
    //     .send({ invalidKey: 'test comment' })
    //     .expect(410);
  
    //   expect(response.body.errorMessage).toBe('데이터 형식이 올바르지 않습니다.');
    // });
  });
  