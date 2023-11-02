package hac.javareact;
import java.io.*;
import javax.servlet.http.*;
import java.util.*;
import javax.servlet.annotation.*;
import com.google.gson.Gson;
import hac.javareact.exceptions.MissingOperandException;

@WebServlet(name = "ServletApi", value = "/api/highscores")
public class ApiServlet extends HttpServlet {
    private static final String FILE_NAME = "scores.dat";
    private static final int TOP_SCORES = 5;
    private static final String NAME = "name";
    private static final String SCORE = "score";
    /**
     * Get request of servlet
     * @param request servlet request
     * @param response servlet response
     * @throws IOException read/write to file exception.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<NameScore> nameScores;
        try {
            nameScores = readFromFile();
        } catch (ClassNotFoundException ex) {
            throw new IOException(ex);
        }

        int limit = Math.min(nameScores.size(), TOP_SCORES);
        List<NameScore> topScores = nameScores.subList(0, limit);

        StringBuilder json = new StringBuilder(" {\"topScores\": [");
        for (NameScore hs : topScores) {
            json.append("{ \"name\": \"").append(hs.getName()).append("\", \"score\": ").append(hs.getScore()).append("},");
        }
        if (!topScores.isEmpty()) {
            json = new StringBuilder(json.substring(0, json.length() - 1));
        }
        json.append("] }");

        response.getWriter().write(json.toString());
    }

    /**
     * Post request of servlet
     * @param request servlet request
     * @param response servlet response
     * @throws IOException read write to file exception
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            BufferedReader reader = request.getReader();
            Gson gson = new Gson();
            NameScore nameScore = gson.fromJson(reader, NameScore.class);
            validateParameters(nameScore.getName(), nameScore.getScore());

            String filePath = getServletContext().getRealPath(".") + File.separator + FILE_NAME;
            List<NameScore> nameScores;
            try {
                nameScores = readFromFile();
            } catch (ClassNotFoundException exception) {
                throw new IOException(exception);
            }

            String name = nameScore.getName();
            int score = nameScore.getScore();
            boolean addName = false;
            for (NameScore nameScore1 : nameScores) {
                if (nameScore1.getName().equals(name)) {
                    if(score < nameScore1.getScore())
                        nameScore1.setScore(score);
                    addName = true;
                }
            }
            if (!addName)
                nameScores.add(nameScore);

            Collections.sort(nameScores);
            FileOutputStream fileOutputStream = new FileOutputStream(filePath);
            synchronized (this) {
                ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
                objectOutputStream.writeObject(nameScores);
                objectOutputStream.flush();
                objectOutputStream.close();
            }
            response.setStatus(HttpServletResponse.SC_OK);
           }
        catch (MissingOperandException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(e.getMessage());
        }
    }

    /**
     * reads from file and returns an array of nameScores.
     * @return List\<NameScore\> array of nameScores.
     * @throws IOException readFile exception
     * @throws ClassNotFoundException class not found exception
     */
    private List<NameScore> readFromFile() throws IOException, ClassNotFoundException {
        String filePath = getServletContext().getRealPath(".") + File.separator + FILE_NAME;
        File file = new File(filePath);
        if (file.exists())
            try (ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(file))) {
                return (List<NameScore>) objectInputStream.readObject();
            }
        return new ArrayList<>();
    }

    /**
     * validates the parameters send by POST request
     * @param name string name
     * @param score int score
     * @throws MissingOperandException Exception missing parameters
     */
    private void validateParameters(String name, int score) throws MissingOperandException {
        if (name == null || name.isEmpty() || score == 0) {
            throw new MissingOperandException(NAME, SCORE);
        }
    }

    /**
     * class NameScore that holds a name and a score.
     */
    private static class NameScore implements Comparable<NameScore>, Serializable {
        private String name;
        private int score;

        /**
         * constructor
         * @param name string name
         * @param score int score
         */
        public NameScore(String name, int score) {
            this.name = name;
            this.score = score;
        }

        /**
         * get name
         * @return name
         */
        public String getName() {
            return name;
        }

        /**
         * get score
         * @return score
         */
        public int getScore() {
            return score;
        }

        /**
         * sets the score
         * @param score int score
         */
        public void setScore(int score) {
            this.score=score;
        }

        /**
         * compares two score
         * @param other the object to be compared.
         * @return the difference between two scores
         */
        public int compareTo(NameScore other) {
            return Integer.compare(score, other.score);
        }
    }


    @Override
    public void init() {
    }

    @Override
    public void destroy() {

    }

}
