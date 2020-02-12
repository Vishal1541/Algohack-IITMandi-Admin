<template>
  <div>
    <div v-if="!loading">
      <Header />
      <b-row class="create-problem-container">
        <b-col>
          <div>
            <b-form-group id="input-group-1" label="Problem code:" label-for="input-1">
              <b-form-input id="input-1" v-model="ques.qID" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Problem name:" label-for="input-2">
              <b-form-input id="input-2" v-model="ques.name" required></b-form-input>
            </b-form-group>

            <label for="description">Problem description:</label>
            <b-form-textarea id="description" v-model="ques.description" rows="7" required></b-form-textarea>

            <label for="inputFormat">Problem input format:</label>
            <b-form-textarea id="inputFormat" v-model="ques.inputFormat" rows="7" required></b-form-textarea>

            <label for="outputFormat">Problem output format:</label>
            <b-form-textarea id="outputFormat" v-model="ques.outputFormat" rows="7" required></b-form-textarea>
          </div>
        </b-col>
        <b-col>
          <label for="constraints">Problem constraints:</label>
          <b-form-textarea id="constraints" v-model="ques.constraints" rows="7" required></b-form-textarea>

          <br />Sample input (.txt):
          <input
            type="file"
            ref="fileSampleInput"
            @change="selectedFileSampleInput"
            required
          />

          <br />Sample output (.txt):
          <input
            type="file"
            ref="fileSampleOutput"
            @change="selectedFileSampleOutput"
            required
          />

          <b-form-group id="input-group-3" label="Time limit (sec):" label-for="input-3">
            <b-form-input id="input-3" v-model="ques.timeLimit" required></b-form-input>
          </b-form-group>

          <br />
          <strong class="correct-soln">Correct solution</strong> (Compiler: C++ (g++ 7.2.0)
          <strong>upload .cpp file</strong>), will
          <strong>not</strong> be shown in the actual contest problem:
          <br />
          <input
            type="file"
            ref="fileCorrectSolution"
            @change="selectedFileCorrectSolution"
            required
          />

          <br />
          <br />
          <strong class="incorrect-soln">Incorrect solution</strong> (Compiler: C++ (g++ 7.2.0)
          <strong>upload .cpp file</strong>), will be given in the actual contest problem:
          <br />
          <input
            type="file"
            ref="fileIncorrectSolution"
            @change="selectedFileIncorrectSolution"
            required
          />

          <br />
          <br />
          <label for="hint">Problem hint:</label>
          <b-form-textarea id="hint" v-model="ques.hint" rows="3" required></b-form-textarea>

          <center>
            <b-button variant="primary" class="btn" @click="createProblem" :disabled="submitted">
              <div v-if="submitted">Please wait...</div>
              <div v-else>Create problem</div>
            </b-button>
            <!-- <b-button type="reset" variant="danger" class="btn" @click="reset">Reset</b-button> -->
          </center>
        </b-col>
      </b-row>
      <div class="submit-status">
        <center>
          <strong>{{submit_status}}</strong>
        </center>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios"
import router from "../router"
import { mapActions } from "vuex"
import Header from "../views/Header.vue"

export default {
  name: "CreateProblem",
  data() {
    return {
      id: null,
      loading: true,
      submitted: false,
      submit_status: '',
      ques: {
        qID: '',
        name: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        sampleInput: '',
        sampleOutput: '',
        timeLimit: '1',
        correctSolution: '',
        incorrectSolution: '',
        hint: '',
        points: '100'
      }
    }
  },
  components: {
    Header
  },
  methods: {
    ...mapActions(["updateUserSession"]),
    async selectedFileSampleInput() {
      let file = this.$refs.fileSampleInput.files[0];
      if (!file || file.type !== 'text/plain') return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.sampleInput = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async selectedFileSampleOutput() {
      let file = this.$refs.fileSampleOutput.files[0];
      if (!file || file.type !== 'text/plain') return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.sampleOutput = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async selectedFileCorrectSolution() {
      let file = this.$refs.fileCorrectSolution.files[0];
      if (!file) return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.correctSolution = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async selectedFileIncorrectSolution() {
      let file = this.$refs.fileIncorrectSolution.files[0];
      if (!file) return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.ques.incorrectSolution = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
    },
    async createProblem() {
      if (this.ques.qID == '') {
        this.submit_status = 'Problem code cannot be left blank';
      } else {
        this.ques.timeLimit = parseFloat(this.ques.timeLimit);
        this.ques.points = parseInt(this.ques.points);
        this.submitted = true;
        await axios.get(`/api/dashboard/qIDexists/${this.ques.qID}`)
          .then(async (res_exists) => {
            if (res_exists.data.exists) {
              this.submit_status = "Problem code already exists. Please enter a new one.";
            } else {
              await axios.post('/api/dashboard/create-problem', this.ques)
                .then((res) => {
                  // console.log(res);
                  this.submit_status = res.data.message;
                })
                .catch((err) => {
                  this.submit_status = err;
                })
            }
          })
        this.submitted = false;
      }
    },
    reset() {
      this.ques.qID = '';
      this.ques.name = '';
      this.ques.description = '';
      this.ques.inputFormat = '';
      this.ques.outputFormat = '';
      this.ques.constraints = '';
      this.ques.sampleInput = '';
      this.ques.sampleOutput = '';
      this.ques.timeLimit = '';
      this.ques.correctSolution = '';
      this.ques.incorrectSolution = '';
      this.ques.hint = '';
      this.ques.points = '100';
    }
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
      if (this.id !== null) {
        this.loading = false;
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  }
}
</script>

<style scoped>
.create-problem-container {
  padding-left: 15px;
  margin-top: 20px;
}

.btn {
  margin-top: 20px;
  margin-right: 20px;
}

.correct-soln {
  color: green;
}

.incorrect-soln {
  color: red;
}

.submit-status {
  margin-top: 20px;
  font-size: 20px;
}
</style>
