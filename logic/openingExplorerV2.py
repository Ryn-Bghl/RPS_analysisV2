import pandas as pd
from IPython.display import HTML, display

# DATA FORMATING

src = input('dataBase?: ')
csv_file = open(f"data\{src}", "r")
data = csv_file.read()
data = data.split("\n")
data = ''.join(data).split('-')

val = []
for i in range(len(data)):
    data[i] = list(data[i])
    val.append(data[i])

data = val

# REMOVE EMPTY LIST FROM DATA

for i in range(len(data)):
    if data[i] == []:
        del data[i]

# USEFULL FUNCTIONS

def get_next_sequence(pre_sequence, data):
    next_sequence = []
    for i in range(len(pre_sequence)):
        for j in range(len(data)):
            if len(pre_sequence) <= len(data[j]):
                if data[j][i] == pre_sequence[i]:
                    next_sequence.append(data[j])
        data = next_sequence
        next_sequence = []
    return data


def get_max_rounds_count(data: list) -> int:
    maxRound = len(data[0])/2
    for i in range(len(data)):
        if maxRound < len(data[i])/2:
            maxRound = len(data[i])/2
    return int(maxRound)


def get_rounds(max_round: list) -> list:
    rounds = []
    for i in range(max_round):
        rounds.append("round " + str(i+1))
    return rounds


maxRound = get_max_rounds_count(data)
rounds = get_rounds(maxRound)


def set_table(data):
    # SET DEFAULT VALUE

    h_rock, h_paper, h_scissors, v_rock, v_paper, v_scissors = [], [], [], [], [], []
    h_Rock, h_Paper, h_Scissors, v_Rock, v_Paper, v_Scissors = [], [], [], [], [], []

    for i in range(maxRound):
        h_rock.append(0)
        h_paper.append(0)
        h_scissors.append(0)
        v_rock.append(0)
        v_paper.append(0)
        v_scissors.append(0)
        h_Rock.append(0)
        h_Paper.append(0)
        h_Scissors.append(0)
        v_Rock.append(0)
        v_Paper.append(0)
        v_Scissors.append(0)

    # COUNT ROCK, PAPER, SCISSORS

    for i in range(len(data)):
        for j in range(len(data[i])):
            if j % 2 == 0:
                if data[i][j] == "r":
                    h_rock[int(j/2)] += 1
                elif data[i][j] == "p":
                    h_paper[int(j/2)] += 1
                elif data[i][j] == "s":
                    h_scissors[int(j/2)] += 1
            else:
                if data[i][j] == "r":
                    v_rock[int((j-1)/2)] += 1
                elif data[i][j] == "p":
                    v_paper[int((j-1)/2)] += 1
                elif data[i][j] == "s":
                    v_scissors[int((j-1)/2)] += 1

    # CONVERT DATA INTO PERCENT

    for i in range(len(h_rock)):
        if (h_rock[i]+h_paper[i]+h_scissors[i]) != 0:
            h_Rock[i] = round(
                h_rock[i]/(h_rock[i]+h_paper[i]+h_scissors[i]), 3)
            h_Paper[i] = round(
                h_paper[i]/(h_rock[i]+h_paper[i]+h_scissors[i]), 3)
            h_Scissors[i] = round(
                h_scissors[i]/(h_rock[i]+h_paper[i]+h_scissors[i]), 3)
        else:
            v_Rock[i], v_Paper[i], v_Scissors[i] = 0, 0, 0

        if (v_rock[i]+v_paper[i]+v_scissors[i]) != 0:
            v_Rock[i] = round(
                v_rock[i]/(v_rock[i]+v_paper[i]+v_scissors[i]), 3)
            v_Paper[i] = round(
                v_paper[i]/(v_rock[i]+v_paper[i]+v_scissors[i]), 3)
            v_Scissors[i] = round(
                v_scissors[i]/(v_rock[i]+v_paper[i]+v_scissors[i]), 3)
        else:
            v_Rock[i], v_Paper[i], v_Scissors[i] = 0, 0, 0

    h_rock, h_paper, h_scissors, v_rock, v_paper, v_scissors = h_Rock, h_Paper, h_Scissors, v_Rock, v_Paper, v_Scissors

    # SET THE TABLE

    # PLAYER AND ENEMY STATS

    H_rock = pd.Series(h_rock, index=rounds)
    H_paper = pd.Series(h_paper, index=rounds)
    H_scissors = pd.Series(h_scissors, index=rounds)
    V_rock = pd.Series(v_rock, index=rounds)
    V_paper = pd.Series(v_paper, index=rounds)
    V_scissors = pd.Series(v_scissors, index=rounds)

    df = pd.DataFrame(
        {'H_Rock': H_rock, 'H_Paper': H_paper, 'H_Scissors': H_scissors,
         'V_Rock': V_rock, 'V_Paper': V_paper, 'V_Scissors': V_scissors})

    # ONLY ENEMY STATS

    # V_rock = pd.Series(v_rock, index=rounds)
    # V_paper = pd.Series(v_paper, index=rounds)
    # V_scissors = pd.Series(v_scissors, index=rounds)

    # df = pd.DataFrame(
    #     {'V_Rock': V_rock, 'V_Paper': V_paper, 'V_Scissors': V_scissors})

    # df.to_html('Client\index.html')
    # df.to_json('json\data.json')
    display(df)

# set_table(get_next_sequence(['rock'], data))

# print(data)
# print(get_next_sequence([], data))

set_table(data)
pre_sequence = []
print(len(data))

while True:
    choice = input('\nchoice: ').lower().replace(' ', '')
    pre_sequence.append(choice)
    print(pre_sequence)
    if choice != 'end':
        print(len(get_next_sequence(pre_sequence, data)))
        set_table(get_next_sequence(pre_sequence, data))
    else:
        break
