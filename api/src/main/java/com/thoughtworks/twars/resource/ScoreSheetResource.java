package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.HomeworkQuizScoreSheet;
import com.thoughtworks.twars.bean.ScoreSheet;
import com.thoughtworks.twars.mapper.HomeworkQuizScoreSheetMapper;
import com.thoughtworks.twars.mapper.ScoreSheetMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Path("/scoresheets")
public class ScoreSheetResource extends Resource {
    @Inject
    private ScoreSheetMapper scoreSheetMapper;

    @Inject
    private HomeworkQuizScoreSheetMapper homeworkQuizScoreSheetMapper;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response findAll() {
        List<ScoreSheet> scoreSheets = scoreSheetMapper.findAll();
        List<Map<String, String>> result = new ArrayList<Map<String, String>>();

        if (scoreSheets == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        for (int i = 0; i < scoreSheets.size(); i++) {
            ScoreSheet scoreSheet = scoreSheets.get(i);
            Map<String, String> map = new HashMap<>();
            map.put("uri", "scoresheets/" + scoreSheet.getId());

            result.add(map);
        }

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response insertScoreSheet(Map data) {
        List<Map> uriResult = new ArrayList<>();

        List<Map> blankQuizSubmits = (List) data.get("blankQuizSubmits");
        Map homeworkQuizSubmits = (Map) data.get("homeworkQuizSubmits");

        if (blankQuizSubmits != null) {
            uriResult = insertBlankQuizScoreSheet(data);
        }

        if (homeworkQuizSubmits != null) {
            uriResult.add(insertHomeworkQuizScoreSheet(data));
        }

        return Response.status(Response.Status.CREATED)
                .entity(uriResult).build();
    }


    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findOne(
            @PathParam("id") int id
    ) {
        ScoreSheet scoreSheet = scoreSheetMapper.findOne(id);

        if (scoreSheet == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Map> itemPosts = new ArrayList<>();
        List<Map> blankQuizSubmits = new ArrayList<>();

        Map itemPost = new HashMap<>();
        Map blankQuizItem = new HashMap<>();

        itemPost.put("answer", scoreSheet.getUserAnswer());
        itemPost.put("quizItem", "quizItems/" + scoreSheet.getQuizItemId());
        itemPosts.add(itemPost);

        blankQuizItem.put("blankQuiz",
                "blankQuizzes/" + scoreSheet.getBlankQuizId());
        blankQuizItem.put("itemPosts", itemPosts);
        blankQuizSubmits.add(blankQuizItem);

        Map map = new HashMap<>();
        map.put("examer", scoreSheet.getExamerId());
        map.put("paper", scoreSheet.getPaperId());
        map.put("blankQuizSubmits", blankQuizSubmits);
        return Response.status(Response.Status.OK).entity(map).build();
    }


    public List<Map> insertBlankQuizScoreSheet(Map data) {
        int blankQuizId;
        int quizItemId;
        String answer;
        int examerId = (int) data.get("examerId");
        int paperId = (int) data.get("paperId");

        List<Map> result = new ArrayList<>();
        List<Map> blankQuizSubmits = (List) data.get("blankQuizSubmits");

        for (int j = 0; j < blankQuizSubmits.size(); j++) {
            blankQuizId = (int) blankQuizSubmits.get(j).get("blankQuizId");
            List<Map> itemPosts = (List) blankQuizSubmits.get(j)
                    .get("itemPosts");
            for (int i = 0; i < itemPosts.size(); i++) {
                Map blankQuizMap = new HashMap<>();

                Map itemPost = itemPosts.get(i);
                answer = (String) itemPost.get("answer");
                quizItemId = (Integer) itemPost.get("quizItemId");
                ScoreSheet sheet = new ScoreSheet();
                sheet.setUserAnswer(answer);
                sheet.setQuizItemId(quizItemId);
                sheet.setBlankQuizId(blankQuizId);
                sheet.setExamerId(examerId);
                sheet.setPaperId(paperId);

                scoreSheetMapper.insertScoreSheet(sheet);

                blankQuizMap.put("uri", "scoresheets/blankQuiz/" +
                        sheet.getId());
                result.add(blankQuizMap);
            }
        }

        return result;
    }

    public Map insertHomeworkQuizScoreSheet(Map data) {
        int examerId = (int) data.get("examerId");
        int paperId = (int) data.get("paperId");
        Map homeworkQuizSubmits = (Map) data.get("homeworkQuizSubmits");

        int homeworkQuizId = (int) homeworkQuizSubmits
                .get("homeworkQuizId");
        Map homeworkSubmitPostHistory = (Map) homeworkQuizSubmits
                .get("homeworkSubmitPostHistory");
        String githubAddress = (String) homeworkSubmitPostHistory
                .get("homeworkURL");
        int homeworkQuizItemId = (int) homeworkSubmitPostHistory
                .get("homeworkQuizItemId");

        HomeworkQuizScoreSheet homeworkQuizScoreSheet =
                new HomeworkQuizScoreSheet();

        homeworkQuizScoreSheet.setPaperId(paperId);
        homeworkQuizScoreSheet.setExamerId(examerId);
        homeworkQuizScoreSheet.setGithubAddress(githubAddress);
        homeworkQuizScoreSheet.setHomeworkQuizId(homeworkQuizId);
        homeworkQuizScoreSheet.setHomeworkQuizItemId(homeworkQuizItemId);

        homeworkQuizScoreSheetMapper
                .insertHomeworkQuizScoreSheet(homeworkQuizScoreSheet);

        Map homeworkMap = new HashMap<>();
        homeworkMap.put("uri",
                "scoresheets/homeworkQuiz/" + homeworkQuizScoreSheet.getId());

        return homeworkMap;
    }
}
